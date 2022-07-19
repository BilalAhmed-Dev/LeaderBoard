const { mongoDb } = require("../app");

//Create new player instance, Called from REST API
function savePlayerToDb(userName, age, callb) {
    let gamer = { userName: userName, gain: 0, rank: 0, diff: 0, age: age };
    mongoDb.collection.insertOne(gamer, (exception, res) => {
        if (exception)
            throw new Error(exception);
        callb(res.insertedId.toHexString());
    });
}
exports.savePlayerToDb = savePlayerToDb;
