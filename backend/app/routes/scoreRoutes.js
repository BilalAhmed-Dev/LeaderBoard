const { app, redisDb, mongoDb } = require("../app");
const async = require('async')

//Import Services

//Import controllers
const { queryRedisDb } = require("../middleware/queryRedisDb");
const { getUserRankList } = require("../middleware/getUserRankList");
const { sharePrizes } = require("../middleware/sharePrizes");



app.post('/api/getTop100', (req, res) => {
    //Get user id from request body
    let userId = req.body.userId ? req.body.userId : null;
    //Query Mongo DB
    mongoDb.collection.find({ rank: { $gt: 0 } }).sort({ rank: 1 }).limit(100).toArray((err, result) => {
        result.forEach(o => {
            //Save result to redis
            redisDb.savetoRedis('top100Player', o.rank, o, function (callback) { });
        });

        //List Results from redis
        queryRedisDb('top100Player', function (callback) {
            let resultList = [];
            async.map(callback, (val, callb) => {
                resultList.push(JSON.parse(val));
            });
            //If User ID Exists
            if (userId) {
                let objectId = mongoDb.objectID(userId);
                getUserRankList(objectId, function (userCallBack) {
                    if (userCallBack) {
                        for (let j = 0; j < userCallBack.length; j++) {
                            if (userCallBack[j].rank > 100) {
                                resultList.push(userCallBack[j]);
                            }
                        }
                    }
                    //Return result list with user rank included
                    res.send(resultList);
                })
            }
            else {
                //Return Result List without user rank included
                res.send(resultList);
            }
        });
    })
})

//Return the list of players in the prize pool
app.get("/api/getPrizePool", (req, res) => {
    mongoDb.gameAwardColl
      .find()
      .sort({ rank: 1 })
      .toArray((err, result) => {
        result.forEach((o) => {
          redisDb.savetoRedis("prizePool", o.rank, o, function (cb) {});
        });
        queryRedisDb("prizePool", function (cb) {
          let list = [];
          async.map(cb, (val, callb) => {
            const parsedVal = JSON.parse(val);
            list.push({
              userName: parsedVal.userName,
              gained: Math.floor(parsedVal.gained),
              rank: parsedVal.rank,
              score: parsedVal.score,
            });
          });
  
          res.send(list);
        });
      });
  });
  
//End Game and Distribute Prizes - Used for manaul override of end of week functionality (For testing purposes only)
app.post("/api/triggerEndGame", (req, res) => {
    // Configure Job Values, Set Game Date
    weekStartedFlag=false;
    let today = new Date();
    let nextDay = new Date(today);
    nextDay.setDate(today.getDate()+1);
    let currentGameDate=new Date(today);
    currentGameDate.setDate(today.getDate()-7);
    //Create unique name for the current game
    let currentGameName=currentGameDate.getFullYear().toString()+(currentGameDate.getMonth+1).toString()+currentGameDate.getDate().toString();

    //Get aggregated player ratings from mongo DB
    mongoDb.getAggregatedRatings()
    .then((res) => {
        console.log(res);
        if(res){
            let totalGains=res.totalGains;
            if(0<totalGains){
                //Take 2% of total gains
                totalGains=totalGains * 0.02;
                //Get top 100 Player list from redis
                redisDb.getByKeyRedis('top100Player',(doc) => {
                    sharePrizes(doc,totalGains,currentGameName,
                        list=>{
                            mongoDb.saveGameAwards(list,(res) => {
                              // Reset all records from collection
                                 mongoDb.collection.updateMany({},{$set:{gain:0,rank:0}},(exception,res) => {
                                     if(exception) throw new Error(exception);
                                     weekStartedFlag=true;
                                 })   

                            });
                        }
                    );                
                });
            }
        }
    })
    .then(function(){
       redisDb.deleteByKeyRedis('online',function(callback){
            console.log('Online List Cleared!');
        });
        redisDb.deleteByKeyRedis('top100Player',function(callback){
            console.log('Top100 Player List Cleared!');
        });
    })
    .then(function(){
        console.log(new Date().toLocaleString()+" | Starting New Game");
    });
    res.send("Ok!");
  });