var express = require('express');
var router = express.Router();
var mongoose = require('mongoose-q')(require('mongoose'), { spread: true });
var UniqueID = require('../models/uid.js');
var crypto = require('crypto');
var os = require('os');

router.get('/', function(req, res, next) {

    var buildID = crypto.createHash('sha256')
        .update(os.cpus()[0].model + req.headers['user-agent'].match(/(\(.+?\))/)[0])
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
