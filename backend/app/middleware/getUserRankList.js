const { mongoDb } = require("../app");
//Get User Rank List from Mongo DB Collecition, Called from REST API
function getUserRankList(objectId, callb) {
    mongoDb.collection.findOne({ '_id': objectId }, (exception, playerObject) => {
        if (exception)
            throw exception;
        if (playerObject) {
            let player = playerObject;
            if (100 < player.rank) {
                mongoDb.collection.find({ rank: { $gte: player.rank - 2, $lt: player.rank + 3 } }).sort({ rank: 1 }).toArray((exception, resultList) => {
                    if (exception)
                        throw exception;
                    callb(resultList);
                });
            }
            else {
                callb(null);
            }

        }
    });
}
exports.getUserRankList = getUserRankList;
