const { redisDb } = require("../app");

//Query Redis DB for a specific set
function queryRedisDb(key, callb) {
    redisDb.getByKeyRedis(key, function (result) {
        callb(result);
    });
}
exports.queryRedisDb = queryRedisDb;
