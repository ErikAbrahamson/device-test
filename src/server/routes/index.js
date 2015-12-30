var express = require('express');
var router = express.Router();
var browser = require('bowser');
var cuid = require('cuid');

// router.get('/', function(req, res, next) {
//
//     res.render('index', {
//         title: 'Augur Device Recognition Test',
//         browser: req.headers['user-agent'],
//         uniqueID: req.cookies['connect.sid'],
//         CUID: cuid()
//     });
//
// });

router.get('/', function(req, res, next) {

    // res.cookie().send(req.cookies);

    res.json({
        browser: req.headers['user-agent'],
        uniqueID: req.cookies['connect.sid'],
        CUID: cuid()
    });

});

router.get('/cookie',function(req, res, next) {
    res.cookie(cookie_name , 'cookie_value').send('Cookie is set');
});

module.exports = router;
