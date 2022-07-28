const { redisDb } = require("../app");

//Query Redis DB for a specific set
// get everything based on a key
function queryRedisDb(key, callb) {
    redisDb.getByKeyRedis(key, function (result) {
        callb(result);
    });
}
exports.queryRedisDb = queryRedisDb;
