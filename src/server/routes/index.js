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
router.post('/', function(req, res, next) {

    var patch = req.device.parser.useragent.patch,
        major = req.device.parser.useragent.major,
           br = req.device.parser.useragent.family,
           os = req.device.parser.useragent.os.family,
           buildID = function(patch, major, br, os) {
               return br[0] + (+patch * +major).toString() + os[0];
           };

    UniqueID.findQ()
        .then(function(result) {
            result.forEach(function(i) {
                if (buildID(patch, major, br, os) === i.assignment) {
                    var query = { '_id': i.id }, options = { new: true };
                        UniqueID.findOneAndUpdateQ(query, buildID(patch, major, br, os), options)
                            .then(function(updated) { res.json(updated); })
                            .catch(function(error) { res.json(error); })
                            .done();
                } else {
                    new UniqueID({ assignment: buildID(patch, major, br, os)} ).saveQ()
                        .then(function(fingerprint) { res.json(fingerprint); })
                        .catch(function(error2) { res.json(error2); })
                        .done();
                }

            });
        })
        .catch(function(error3) { res.json(error3); })
        .done();

});

router.get('/', function(req, res, next) {

    var patch = req.device.parser.useragent.patch,
        major = req.device.parser.useragent.major,
           br = req.device.parser.useragent.family,
           os = req.device.parser.useragent.os.family,
           buildID = function(patch, major, br, os) {
               return br[0] + (+patch * +major).toString() + os[0];
           };

    UniqueID.findQ()
        .then(function(result) {
            result.forEach(function(i) {

                console.log(buildID(patch, major, br, os) , i.assignment);

                if (buildID(patch, major, br, os) === i.assignment) {
                    router.put('/', function(req, res, next) {
                        var query = { '_id': req.params.id }, options = { new: true };
                            UniqueID.findOneAndUpdateQ(query, buildID(patch, major, br, os), options)
                                .then(function(updated) { res.json(updated); })
                                .catch(function(error) { res.json(error); })
                                .done();
                    });
                } else {
                    router.post('/', function(req, res, next) {
                        new UniqueID({ assignment: buildID(patch, major, br, os)} ).saveQ()
                            .then(function(fingerprint) { res.json(fingerprint); })
                            .catch(function(error2) { res.json(error2); })
                            .done();
                    });
                }
            });
            res.json({ 'Browser ID:': buildID(patch, major, br, os)});
        })
        .catch(function(error) { res.json(error); })
        .done();
});

module.exports = router;
