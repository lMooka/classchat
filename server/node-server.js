var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var app = express();
var uuid = require("uuid");
var mongodb = undefined;

// MongoDB
var MongoClient = require('mongodb').MongoClient;
var uri = "mongodb://classchat:classchat123@classchat-shard-00-00-jmrw7.mongodb.net:27017,classchat-shard-00-01-jmrw7.mongodb.net:27017,classchat-shard-00-02-jmrw7.mongodb.net:27017/classchat?ssl=true&replicaSet=classchat-shard-0&authSource=admin";
MongoClient.connect(uri, function(err, db) {
    console.log("connected to mongodb.")
    mongodb = db;
});

var message = [{
    userid:'KdhAUoe2-43',
    username:'Guilherme',
    datetime:'23-11-2017 11:39:40',
    message:'Hello World'
}]

// uses
app.use(function (req, res, next) {
    
        // Website you wish to allow to connect
        res.setHeader('Access-Control-Allow-Origin', '*');
    
        // Request methods you wish to allow
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    
        // Request headers you wish to allow
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    
        // Set to true if you need the website to include cookies in the requests sent
        // to the API (e.g. in case you use sessions)
        res.setHeader('Access-Control-Allow-Credentials', true);
    
        // Pass to next layer of middleware
        next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.listen(3000, function() {
    console.log(`Server running at http://localhost:3000/`);
});

app.get('/', function(req, res) {
    res.json(message);
});

// createuser
app.get('/createuser', function(req, res) {
    // Define um Id unico pro usuário que é armazenado no cache do browser
    user = {
        userid : uuid.v4(),
        username : '',
        creation_date : new Date().getTime()
    };
    /* mongodb insert */
    mongodb.collection('users').insertOne(user);
    /* */

    console.log('user created: ' + user.userid);
    res.json(user);
});

// createuser
app.get('/changeusername', function(req, res) {
    var userid = req.param('userid');
    var username = req.param('username');

    if(userid != undefined && username != undefined) {
        var resultArray = [];

        mongodb.collection('users').updateOne(
            { "userid" : userid },
            { $set: { "username": username} },
            function(err, results) {
              var cursor = mongodb.collection('users').find({'userid' : userid});
              cursor.forEach(function(doc, err) {
                //assert.equal(null, err);
                resultArray.push(doc);
              }, function() {
                res.json(resultArray);
              });
         });
    }
});

app.get('/messages', function(req, res) {
    var chatid = req.param('chatid');
    var after = req.param('after');

    if(chatid == undefined) {
        res.json({error:'No chatId sent. Use /messages?chatid=(string)'});
        return;
    }
        
    if(after != undefined) {

    }

    res.json(message);
});