var express = require('express');
var router = express.Router();
var mongoose = require('mongoose-q')(require('mongoose'), { spread: true });
var UniqueID = require('../models/uid.js');

/*
A) When a visitor hits a page, assign a unique ID to that browser
B) After the browser is restarted, when the visitor hits the page again the browser has the same ID
C) After the browser clears cookies, the browser is still assigned the same ID
D) After the browser clears cache, cookies, and all, the browser is still assigned the same ID
E) Some, or all, of the browsers (chrome, firefox, opera, IE, Safari, etc.) on the device share the same ID
*/

// var assignID = function(req, res) {
//     req.device.parser ? req.device.parser.useragent
// }

router.get('/', function(req, res, next) {
    res.json(req.device.parser.useragent);
});

router.post('/browser', function(req, res, next) {
    new UniqueID(req.body).saveQ()
        .then(function(result) { res.json(result); })
        .catch(function(error) { res.json(error);  });
});

module.exports = router;
