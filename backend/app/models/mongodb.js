// dotenv is required to load environment variables
const dotenv = require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;
let ObjectID = require('mongodb').ObjectID;

const uri = process.env.DB_URL_MONGO;
let mongoDB=new MongoClient(uri, { useNewUrlParser: true });

class _mongodb{
    constructor(){
        //Configure Mongo DB Connector
        mongoDB.connect((error,client) => {
            if(error){
                console.log(error);
                mongoDB.close();
            }
            // leaderboard DB
            this.db=mongoDB.db(process.env.DB_NAME_MONGO);
            //Setup default collection
            this.collection = this.db.collection(process.env.DB_BASE_COL_MONGO);
            //Setup award collection
            this.gameAwardColl = this.db.collection(process.env.DB_PRIZE_COL_MONGO);
            console.log("Successfully Connected mongodb !!");
        });
    }
    
    //Close database connection
    closeDbConnection(){
        mongoDB.close();
    }
    
    objectID(objectId){
        if(objectId) return new ObjectID(objectId);
        else         return null;
    }
    
    //find query using sort / limit parameters
    find(query,sort,limit,cb){
        this.collection.find(query).sort(sort).limit(limit).toArray((err,result)=>{
            cb(result);
        });
    }

    //async find query using sort / limit parameters
    async findAsync(query,sort,limit,cb){
        this.collection.find(query).sort(sort).limit(limit).toArray((err,result)=>{
            cb(result);
        });
    }
    
    //async Update Single Object
    async updateSingleItemAsync(objectId,data){
        this.collection.updateOne({'_id':objectId},{$set:data,$currentDate: { lastModified: true }}
        ,(err,result)=>{
            console.log(result);
            return result;
        });
      }
    
    //Return aggregated player ratings
    getAggregatedRatings(){
        return new Promise((resolve, reject) => {
            this.collection.aggregate([{$group : {_id : null,totalGains:{ $sum: "$gain" }}}])
            .each((err, result)=> {
                if (err || !result) {
                    reject(err);
                }
                else {
                    resolve(result);
                }
            });
        })
    }

    saveGameAwards(records,callb){
        this.gameAwardColl.insertMany(records,function(err,res){
            if(err) throw new Error(err);
            if(res.insertedCount>0){
                console.log("Top 100's awards has been shared.");
            }
            callb(res.insertedCount);
        });
    }

}

module.exports = _mongodb;

