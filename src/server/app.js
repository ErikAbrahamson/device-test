var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var swig = require('swig');
var session = require('express-session');
var browser = require('bowser');
var device = require('express-device');
// var Fingerprint2 = require('fingerprintjs2');
//
// new Fingerprint2().get(function(result, components){
//   console.log(result); //a hash, representing your device fingerprint
//   console.log(components); // an array of FP components
// });

var routes = require('./routes/index.js');

var app = express();

var swig = new swig.Swig();
app.engine('html', swig.renderFile);
app.set('view engine', 'html');

app.set('views', path.join(__dirname, 'views'));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
    secret: 'whatever',
    saveUnitialized: true,
    resave: true
}));

app.use(device.capture({ parseUserAgent: true }));
device.enableDeviceHelpers(app);
device.enableViewRouting(app);

app.use(express.static(path.join(__dirname, '../client')));
app.use('/', routes);
app.use(function(req, res, next) {

    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

if (app.get('env') === 'development') {

    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message, error: {}
    });
});

module.exports = app;
