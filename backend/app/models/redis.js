let redis = require('redis');

//Load Evironment Variables
const uri = process.env.URL_REDIS;
const port = process.env.PORT_REDIS;

class _redis{
    constructor(){
         //Create redis client & connect to redis server
        this.client = redis.createClient({
        host: uri,
        port: port
        });
        this.client.on('connect', function() {
            console.log('connected redis server');
        });
    }

    //Save object to redis
    savetoRedis(key,id,val,callb) {
        let today = new Date().toLocaleString();
        val['lastModified']=today;
        let json = JSON.stringify(val);
        this.client.hset(key, `${id}`, `${json}`,function(exception,cb){
            if(exception) throw new Error(exception);
            callb(cb);
        });
    }
    
    //Trigger user loggout 
    triggerLogoutByIdRedis(key,id,callb){
        this.client.hdel(key,id,function(exception,res){
            if(exception) throw new Error(exception);
            callb(res);
        })
    };
    
    //Delete object by key
    deleteByKeyRedis(key,callb){
        this.client.del(key,function(exception,res){
            if(exception) throw new Error(exception);
            callb(res);
        });
    }
    
    //Get object by key from redis
    getByKeyRedis(key,callb){
         this.client.hgetall(key,function(exception,result){
             if(exception) throw exception;
             callb(result);
         })
    }

    //Get Player by ID from Redis
    getPlayerByIdRedis(key,playerId,callb){
        this.client.hget(key,playerId,function(exception,result){
            if(exception) throw exception;
            callb(JSON.parse(result));
        })
    }
    
}

module.exports = _redis;