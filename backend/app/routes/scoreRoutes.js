const { app, redisDb, mongoDb } = require("../app");
const async = require('async')

//Import Services
const schedulingService = require('../services/scheduling-service');

//Import controllers
const { queryRedisDb } = require("../middleware/queryRedisDb");
const { getUserRankList } = require("../middleware/getUserRankList");
const { setPlayerRank } = require("../middleware/setPlayerRank");
const { sharePrizes } = require("../middleware/sharePrizes");

app.post('/api/addNewScore', (req, res) => {
    //Check if week has been started
    if (schedulingService.isWeekStarted()) {
        //Collect User information from request
        let userId = req.body.userId;
        let score = req.body.score;
        let currentDate = new Date();
        //Get User by ID
        redisDb.getPlayerByIdRedis('online', userId, (callback) => {
            //Check if user exists and loggedin
            if (callback) {
                //Configure Player Information
                let playerObject = callback;
                let lastUpdateTime = new Date(playerObject.lastModified);
                let Diff = (currentDate - lastUpdateTime) / 1000;
                
                //Check Score Difference
                if (1.00 > Diff || 1 === playerObject['readOnly']) {
                    if (1.00 < Diff) {
                        //Set Player Read Only Status
                        playerObject['readOnly'] = 0;
                        //Update Player
                        redisDb.savetoRedis('online', userId, playerObject, (callback) => { });
                    }
                    res.send({ 'status': 'Score updated successfully' });
                }
                else {
                    //Set Player Read Only Status
                    playerObject['readOnly'] = 1;
                    //Update Player Information
                    redisDb.savetoRedis('online', userId, playerObject, (callback) => { });
                    //Set Player Scofre
                    playerObject.gain += parseInt(score);
                    //Get Player Rank
                    let lastPlayerRank = playerObject.rank;
                    //Set Player Last Modified Time
                    playerObject.lastModified = currentDate.toLocaleString();
                    //Create Mongo Db Query Object
                    let queryObject = { gain: { $gt: playerObject.gain } };
                    let sort = { gain: 1 };
                    let limit = 1;
                    mongoDb.findAsync(queryObject, sort, limit, function (callback) {
                        if (callback.length > 0) {
                            previousPlayer = callback[0];
                            playerObject.rank = previousPlayer.rank + 1;
                            if (0 < lastPlayerRank)
                                playerObject.diff = lastPlayerRank - playerObject.rank;
                        }
                        else {
                            playerObject.rank = 1;
                            if (0 < lastPlayerRank)
                                playerObject.diff = lastPlayerRank - playerObject.rank;

                        }
                        //Update Player Rank
                        setPlayerRank(playerObject, lastPlayerRank, function (callback) {});
                    })
                    res.send({ 'status': 'Score updated successfully' });
                }
            }
            else {
                res.send({ 'status': 'Player is not online!' });
            }
        })
    }
    else {
        res.send({ 'status': 'Unable to update score, Game week is finished' })
    }
});

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
                                 mongoDb.collection.updateMany({},{$set:{gain:0,diff:0,rank:0}},(exception,res) => {
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