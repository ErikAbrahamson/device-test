var express = require('express');
var router = express.Router();
var mongoose = require('mongoose-q')(require('mongoose'), { spread: true });
var UniqueID = require('../models/uid.js');
var crypto = require('crypto');

/*
A) When a visitor hits a page, assign a unique ID to that browser
B) After the browser is restarted, when the visitor hits the page again the browser has the same ID
C) After the browser clears cookies, the browser is still assigned the same ID
D) After the browser clears cache, cookies, and all, the browser is still assigned the same ID
E) Some, or all, of the browsers (chrome, firefox, opera, IE, Safari, etc.) on the device share the same ID
F) If you got this to work on desktop, get this to also work on mobile
G) Create a scalable solution
*/

router.post('/', function(req, res, next) {

    var buildID = crypto.createHash('sha256')
        .update(req.connection._peername.address)
        .digest('hex');

    console.log(req.connection._peername.address);

    UniqueID.findQ(({ 'fingerprint': buildID }))

        .then(function(result) {
            if (result.length === 0) {
                new UniqueID({ fingerprint: buildID }).saveQ()
                    .then(function(data) { res.json(data); })
                    .catch(function(error) { res.json(error); });
            } else {
                var options = { new: false }, query = { 'fingerprint': buildID };
                UniqueID.findOneAndUpdateQ(query, buildID, options)
                    .then(function(data) { res.json(data); })
                    .catch(function(error) { res.json(error); });
            }
        })
        .catch(function(error) { res.json(error); })
        .done();
});

router.get('/', function(req, res, next) {

    UniqueID.findQ()
        .then(function(result) { res.json(result); })
        .catch(function(error) { res.json(error); })
        .done();

});


module.exports = router;
