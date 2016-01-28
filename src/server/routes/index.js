var express = require('express');
var router = express.Router();
var mongoose = require('mongoose-q')(require('mongoose'), { spread: true });
var UniqueID = require('../models/uid.js');
var crypto = require('crypto');

router.post('/', function(req, res, next) {

    console.log(req.hostname, req.connection);

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

    console.log(req.hostname);

//     console.log(
//         req.connection._bytesDispatched,
//         req.connection._connecting,
//         req.connection._handle,
//         req.connection._parent,
//         req.connection._host,
//         req.connection._readableState,
//         req.connection.readable,
//         req.connection.domain,
//         req.connection._events,
//         req.connection._eventsCount,
//         req.connection._maxListeners,
//         req.connection.bytesRead,
//         req.connection._bytesDispatched,
//         req.connection._sockname,
//         req.connection._pendingData,
//         req.connection._pendingEncoding,
//         req.connection.server,
//         req.connection._idleTimeout,
//         req.connection._idleNext,
//         req.connection._idlePrev,
//         req.connection._idleStart,
//         req.connection.parser,
//         req.connection.on,
//         req.connection._consuming,
//         req.connection._httpMessage
// );

    UniqueID.findQ()
        .then(function(result) { res.json(req.connection.server._handle); })
        .catch(function(error) { res.json(error); })
        .done();

});


module.exports = router;
