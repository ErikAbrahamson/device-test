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

router.get('/', function(req, res, next) {

    UniqueID.findQ()
        .then(function(result) { res.json(result); })
        .catch(function(error) { res.json(error); })
        .done();
});

router.post('/', function(req, res, next) {

    // Build unique ID with express-device to parse userAgent headers
    var patch = req.device.parser.useragent.patch,
        major = req.device.parser.useragent.major,
           br = req.device.parser.useragent.family,
           os = req.device.parser.useragent.os.family,
           buildID = function(patch, major, br, os) {
               return br[0] + (+patch * +major).toString() + os[0];
           };

    UniqueID.findQ()
        .then(function(result) {

            // Check if any browsers have already been assigned
            if (result.length !== 0) {
                var counter = 0, query = { 'fingerprint': buildID(patch, major, br, os) };
                result.forEach(function(i) {
                    if (buildID(patch, major, br, os) === i.fingerprint) counter++;
                });

                // Update current browser for new session
                if (counter >= 1) {
                    var options = { new: false };
                    UniqueID.findOneAndUpdateQ(query, buildID(patch, major, br, os), options)
                        .then(function(data) { res.json(data); })
                        .catch(function(error) { res.json(error); });

                // Create new unique ID if no browser exists yet
                } else if (counter === 0) {
                    new UniqueID({ fingerprint: buildID(patch, major, br, os) }).saveQ()
                        .then(function(data) { res.json(data); })
                        .catch(function(error) { res.json(error); });
                }
            // Initial browser store
            } else {
                new UniqueID({ fingerprint: buildID(patch, major, br, os) }).saveQ()
                    .then(function(data) { res.json(data); })
                    .catch(function(error) { res.json(error); });
            }
        })
        .catch(function(error) { res.json(error); })
        .done();

});

module.exports = router;
