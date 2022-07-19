const Mongo= require('../models/mongodb');
let redis = require('../models/redis');

let mongoDb=new Mongo();
const redisDb= new redis(); 

let nodeSchedule = require('node-schedule');
//The following variable is used to ensure that players are only rewarded at the end of the week.
let weekStartedFlag=true; 

//Scheduling Jobs

// Job 01 - Scheduled job reset ranking differences for all gamers at the end of the day.
let jobResetPlayerRank = nodeSchedule.scheduleJob('1 0 0 * * *', function () {
    if(weekStartedFlag){
        mongoDb.collection.updateMany(
            {},
            {$set:{diff:0}},
            function(exception,doc){
                if(exception) throw new Error(exception);
                console.log(new Date().toLocaleString()+" // Player ' Ranking Difference Reset Completed!"); 
            }
        )
    }
});

// Job 02 - Scheduled job update top 100 players every 5 secounds
let jobUpdateTop100PlayerRedis=nodeSchedule.scheduleJob('*/'+process.env.TOP100_CALLING_INTERVAL+' * * * * *',function(){ 
    if(weekStartedFlag){
        redisDb.deleteByKeyRedis('top100Player',(callback)=>{
            mongoDb.collection.find({rank:{$gt:0}}).sort({rank:1}).limit(100).toArray((exception,result)=>{
            if(exception) throw new Error(exception);
                if(result){
                    if(0 < result.length){
                        result.forEach(o=>{
                            redisDb.savetoRedis('top100Player',o.rank,o,function(callback){
                            });
                        });
                        console.log(new Date().toLocaleString()+" | Top 100 player updated successfully!");  
                    }  
                }
            });     
        })  
    }
})

// Job 03 - Scheduled Job to Trigger End of Week and Distribute Prizes
let JobEndOfWeekListGenerator=nodeSchedule.scheduleJob('0 55 23 * * 1',function(){
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
    .then(function(callback){
        console.log(callback);
        if(callback){
            let totalGains=callback.totalGains;
            if(0<totalGains){
                //Take 2% of total gains
                totalGains=totalGains * 0.02;
                //Get top 100 Player list from redis
                redisDb.getByKeyRedis('top100Player',function(doc){
                    sharePrize(doc,totalGains,currentGameName,
                        list=>{
                            mongoDb.saveAwards(list,function(callback){
                              // Reset all records from collection
                                 mongoDb.collection.updateMany({},{$set:{gain:0,diff:0,rank:0}},(exception,res)=>{
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
});


function isWeekStarted() {  
    return weekStartedFlag;
}
exports.isWeekStarted = isWeekStarted;

//Dedicated function to calcuate prize according to competition rules
function sharePrize(doc,totalGains,gameName,callb){
    prizeList=[];
    if(doc){
        let keys=Object.keys(doc);    
        let len =keys.length; 
        test=0.00;
        let topThree=0.00;
        //Split Prize by Key
        for(let i=0;i<len;i++){
            let gained=0.00;
            if("1"===keys[i]){
                //20% Prize for first player
                gained = totalGains * 0.20;
                topThree += gained;
            }
            else if("2"===keys[i]){
                //15% prize for 2nd player
                gained = totalGains * 0.15;
                topThree += gained;
            }
            else if("3"===keys[i]){
                //10% prize for third player
                gained = totalGains * 0.10;
                totalGains = totalGains - topThree - gained;
            }
            else{
                //Distribute the rest to the other players in the top 100 rank
                gained = (((len+1)-i)*totalGains)/ ((len-3)*(len-2)/2); // set prize for remaining 97 players
            }
            //Push Prize List
            let gamer=JSON.parse(doc[keys[i]]);
            prizeList.push({
                userName : gamer.userName,
                gained : gained,
                rank : i,
                score : gamer.gain,
                gameName : gameName
            })
        }
    }
    
    callb(prizeList);
}
