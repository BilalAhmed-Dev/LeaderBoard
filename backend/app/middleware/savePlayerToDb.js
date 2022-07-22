const { mongoDb } = require("../app");

//Create new player instance, Called from REST API
function savePlayerToDb(userName, age,country, callb) {
    let gamer = { userName: userName,country, gain: 0, rank: 0,  age: age };
    mongoDb.collection.insertOne(gamer, (exception, res) => {
        if (exception)
            throw new Error(exception);
            // passing userId to the callback
        callb(res.insertedId.toHexString());
    });
}
exports.savePlayerToDb = savePlayerToDb;
