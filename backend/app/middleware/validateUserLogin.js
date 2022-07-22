const { mongoDb, redisDb } = require("../app");

//Check if user login informatoin is correct and set login status
function validateUserLogin(userId, callb) {
    mongoDb.collection.findOne({ '_id': userId }, (exception, playerObject) => {
        if (exception)
            throw exception;
        if (playerObject) {
            // set player status to online in redis cache
            // I could search userId in redis and know if hes online
            redisDb.savetoRedis('online', userId.toHexString(), playerObject, function (callback) {
                callb(callback);
            });
        }
        else {
            callb('Unable to find player, invalid login id!');
        }
    });
}
exports.validateUserLogin = validateUserLogin;
