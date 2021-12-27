const { app, redisDb, mongoDb } = require("../app");

//Import controllers
const { validateUserLogin } = require("../middleware/validateUserLogin");
const { savePlayerToDb } = require("../middleware/savePlayerToDb");


//API endpoint to enable user to signup
app.post('/api/signup', (req, res) => {
    let userName = req.body.userName;
    let age = req.body.age;
    savePlayerToDb(userName, age, (callback) => {
        res.send({ 'New User has been created successfully, User Id': callback });
    });
});

//API endpoint to enable user login
app.post('/api/login', (req, res) => {
    //Get user login information from post request
    let userId = mongoDb.objectID(req.body.userId);
    //Validate user informatoin and return login status
    validateUserLogin(userId, function (callback) {
        res.send({ 'User login status': callback });
    });
});

app.post('/api/logout', (req, res) => {
    redisDb.triggerLogoutByIdRedis('online', req.body.userId, function (callback) {
        res.send({ 'User Logged out Successfully': callback });
    });
});
