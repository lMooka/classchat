var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var uuid = require("uuid");

var app = express();
var mongodb = undefined;

// MongoDB
var MongoClient = require('mongodb').MongoClient;
var uri = "mongodb://classchat:classchat123@classchat-shard-00-00-jmrw7.mongodb.net:27017,classchat-shard-00-01-jmrw7.mongodb.net:27017,classchat-shard-00-02-jmrw7.mongodb.net:27017/classchat?ssl=true&replicaSet=classchat-shard-0&authSource=admin";
MongoClient.connect(uri, function(err, db) {
    console.log("connected to mongodb.")
    mongodb = db;
});// uses
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
                resultArray.push(doc);
              }, function() {
                res.json(resultArray);
              });
         });
    }
});

app.get('/messages', function(req, res) {
    var chatid = req.param('chatid');
    var after = Number(req.param('after'));

    if(chatid == undefined) {
        res.json({error:'No chatId sent. Use /messages?chatid=(string)'});
        return;
    }
    var resultArray = [];
    if(after == NaN) {
        // recupera todas as mensagens
        after = 'default';
    }
    // recupera mensagens depois do datetime passado (after)
    var cursor = mongodb.collection('messages').find({"chatid" : chatid, "creation_date" : { "$gt" : after}});
    cursor.forEach(function(doc, err) {
        resultArray.push(doc);
    }, function() {
        res.json(resultArray);
    });
});

app.get('/send', function(req, res) {
    var chatid = req.param('chatid');
    var userid = req.param('userid');
    var message = req.param('message');

    // Verifica se as informações passadas estão corretas
    if(chatid == NaN || userid == NaN || message == NaN) {
        res.json({ error : "wrong params"});
        return;
    }

    // Cria o objeto da mensagem para inserir no banco
    message = {
        "chatid" : chatid,
        "userid" : userid,
        "message" : message,
        "creation_date" : new Date().getTime()
    };

    /* mongodb insert */
    mongodb.collection('messages').insertOne(message);
    console.log(`${chatid}-${userid}: ${message.message}`);
    res.json({ success : "message added123"});
});

