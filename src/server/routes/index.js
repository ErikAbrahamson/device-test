var express = require('express');
var router = express.Router();
var mongoose = require('mongoose-q')(require('mongoose'), { spread: true });
var UniqueID = require('../models/uid.js');
var crypto = require('crypto');

router.get('/', function(req, res, next) {
    console.log(req.connection.remoteAddress);

    var buildID = crypto.createHash('sha256')
        // .update(req.headers['user-agent'].toString())
        .update(req.connection.remoteAddress)
        .digest('hex');

    UniqueID.findQ(({ fingerprint: buildID }))
        .then(function(result) {
            var options = { new: false }, query = { fingerprint: buildID };
            if (result.length === 0) new UniqueID(query).saveQ();
            else UniqueID.findOneAndUpdateQ(query, buildID, options);
        })
        .catch(function(error) { res.json(error); });

    UniqueID.findQ()
        .then(function(data) {
            res.render('index', { fingerprint: buildID, devices: data }); })
        .catch(function(error) { res.json(error); })
        .done();
});

module.exports = router;
