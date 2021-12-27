const { mongoDb, redisDb } = require("../app");

//Check if user login informatoin is correct and set login status
function validateUserLogin(userId, callb) {
    mongoDb.collection.findOne({ '_id': userId }, (exception, playerObject) => {
        if (exception)
            throw exception;
        if (playerObject) {
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
