var express = require('express');
var router = express.Router();
var browser = require('bowser');

/*
A) When a visitor hits a page, assign a unique ID to that browser
B) After the browser is restarted, when the visitor hits the page again the browser has the same ID
C) After the browser clears cookies, the browser is still assigned the same ID
D) After the browser clears cache, cookies, and all, the browser is still assigned the same ID
E) Some, or all, of the browsers (chrome, firefox, opera, IE, Safari, etc.) on the device share the same ID
*/


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

    res.json(req.device);
});

router.get('/cookie',function(req, res, next) {
    res.cookie(cookie_name , 'cookie_value').send('Cookie is set');
});

module.exports = router;
