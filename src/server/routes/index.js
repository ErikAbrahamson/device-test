var express = require('express');
var router = express.Router();
var mongoose = require('mongoose-q')(require('mongoose'), { spread: true });
var UniqueID = require('../models/uid.js');
var crypto = require('crypto');

router.post('/', function(req, res, next) {

    var buildID = crypto.createHash('sha256')
        .update(req.hostname)
        .digest('hex');

    UniqueID.findQ(({ fingerprint: buildID }))
        .then(function(result) {

            if (result.length === 0) {
                new UniqueID({ fingerprint: buildID }).saveQ()
                    .then(function(data) { res.json(data); })
                    .catch(function(error) { res.json(error); });
            } else {
                var options = { new: false }, query = { fingerprint: buildID };
                UniqueID.findOneAndUpdateQ(query, buildID, options)
                    .then(function(data) { res.json(data); })
                    .catch(function(error) { res.json(error); });
            }
        })
        .catch(function(error) { res.json(error); })
        .done();
});

router.get('/', function(req, res, next) {

    var buildID = crypto.createHash('sha256')
        .update(req.hostname)
        .digest('hex');

    UniqueID.findQ()
        .then(function(result) { res.json(buildID); })
        .catch(function(error) { res.json(error); })
        .done();

});


module.exports = router;
