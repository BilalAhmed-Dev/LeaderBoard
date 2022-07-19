const { mongoDb, redisDb } = require("../app");

//Set player rank value, called via REST API
async function setPlayerRank(player, lastRank, callb) {
    //Get Player object from DB
    objectId = mongoDb.objectID(player._id);
    //Collect player information
    let data = { gain: player.gain, rank: player.rank, diff: player.diff };
    //Update Player information
    mongoDb.updateSingleItemAsync(objectId, data, (err, result) => { });
    //Set Player Read only status
    player['readonly'] = 0;
    //Save player informatoin to redis
    redisDb.savetoRedis('online', player._id, player, (callback) => {
        let query = { '_id': { $ne: objectId }, 'rank': { $gte: player.rank } };
        if (0 < lastRank) {
            query['rank']['$lte'] = lastRank;
        }
        //Update Rank
        let update = { $inc: { 'rank': 1, 'diff': -1 }, $currentDate: { 'lastModified': true } };
        //Update Database
        mongoDb.collection.updateMany(
            query,
            update,
            function (exception, doc) {
                if (exception)
                    throw new Error(exception);
                callb(doc);
            });
    });
}
exports.setPlayerRank = setPlayerRank;
