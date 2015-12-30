var express = require('express');
var router = express.Router();
// var cookieParser = require('cookie-parser');

router.get('/', function(req, res, next) {
    console.log("Cookies :  ", req.cookies);
    res.render('index', {
        title: 'Augur Device Recognition Test',
        uniqueID: JSON.stringify(req.cookies)
    });
});

router.get('/cookie',function(req, res, next) {
    res.cookie(cookie_name , 'cookie_value').send('Cookie is set');
});

module.exports = router;
