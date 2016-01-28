var express = require('express');
var router = express.Router();
var mongoose = require('mongoose-q')(require('mongoose'), { spread: true });
var UniqueID = require('../models/uid.js');
var crypto = require('crypto');

router.get('/', function(req, res, next) {

    var buildID = crypto.createHash('sha256')
        .update(req.headers['user-agent'].toString())
        .digest('hex');

    UniqueID.findQ(({ fingerprint: buildID }))
        .then(function(result) {

            if (result.length === 0) {
                new UniqueID({ fingerprint: buildID }).saveQ()
                    .then(function(data) { res.render('index', {
                        uniqueID: buildID
                    }); })
                    .catch(function(error) { res.json(error); });

            } else {
                var options = { new: false }, query = { fingerprint: buildID };
                UniqueID.findOneAndUpdateQ(query, buildID, options)
                    .then(function(data) {

                        res.render('index', {
                        uniqueID: data.fingerprint
                    }); })
                    .catch(function(error) { res.json(error); });
            }
        })
        .catch(function(error) { res.json(error); })
        .done();

});

module.exports = router;
