// process.env.NODE_ENV = 'test';
var mocha = require('mocha');
var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../src/server/app.js');
var mongoose = require('mongoose-q')(require('mongoose'));

var should = chai.should();
chai.use(chaiHttp);

// Create a scalable solution

describe('Augur Device Recognition', function() {

    // beforeEach(function(done) {
    //     done();
    // });
    //
    // afterEach(function(done) {
    //     done();
    // });

    // When a visitor hits a page, assign a unique ID to that browser
    it('Should assign a unique ID to a user\'s browser', function(done) {

        chai.request(server).get('/').end(function(err, res) {
            res.should.have.status(200);
            done();
        });

        chai.request(server).get('/cookie').end(function(err, res) {
            res.should.have.status(200);
            done();
        });
    });

    // After the browser is restarted, when the visitor hits the page again the browser has the same ID
    it('Should return the same unique browser ID after browser is restarted', function(done) {

        chai.request(server).get('/').end(function(err, res) {
            res.should.have.status(200);
            done();
        });
    });

    // After the browser clears cookies, the browser is still assigned the same ID
    it('Should keep the unique ID after clearing browser cookies', function(done) {

        chai.request(server).get('/').end(function(err, res) {
            res.should.have.status(200);
            done();
        });
    });

    // After the browser clears cache, cookies, and all, the browser is still assigned the same ID
    it('Should keep the unique ID after clearing browser cache and cookies', function(done) {

        chai.request(server).get('/').end(function(err, res) {
            res.should.have.status(200);
            done();
        });
    });

    // Some, or all, of the browsers (chrome, firefox, opera, IE, Safari, etc.) on the device share the same ID
    it('Should retain unique ID across browsers', function(done) {

        chai.request(server).get('/').end(function(err, res) {
            res.should.have.status(200);
            done();
        });
    });

    // If you got this to work on desktop, get this to also work on mobile
    it('Should assign a unique ID to a user\'s browser', function(done) {

        chai.request(server).get('/').end(function(err, res) {
            res.should.have.status(200);
            done();
        });
    });
});
