var express = require('express');
var path = require('path');
var fs = require("fs");
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongo = require('mongoskin');

var routes = require('./routes/index');

// db authentication
var auth = fs.readFileSync('auth.txt', "utf8").toString().split(',');
auth[0] = auth[0].trim()
auth[1] = auth[1].trim()

var f = require('util').format;
var urlTmpl = 'mongodb://%s:%s@localhost:27017/%s?authSource=admin'

var db = mongo.db(f(urlTmpl, auth[0], auth[1], 'namwkim'), {native_parser: true});
db.toObjectID = mongo.helper.toObjectID;

var app = express();

var server = require('http').Server(app);
var io = require('socket.io')(server);
require('./routes/socket')(io, db);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hjs');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
// db settings
app.use(function(req, res, next){
    req.db = db;
    req.toObjectID = mongo.helper.toObjectID;
    next();
});

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = server;
