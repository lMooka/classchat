var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');

var app = express();

var message = [{
    guid:'KdhAUoe2-43',
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

app.get('/messages', function(req, res) {
    res.json(message);
});