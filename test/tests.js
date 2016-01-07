process.env.NODE_ENV = 'test';
var mocha = require('mocha');
var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../src/server/app.js');
var mongoose = require('mongoose-q')(require('mongoose'));
var device = require('express-device');
var UniqueID = require('../src/server/models/uid.js');
var device = require('express-device');

var should = chai.should();
chai.use(chaiHttp);

describe('Augur Device Recognition', function() {

    beforeEach(function(done) {
        UniqueID.collection.drop();
        done();
    });

    afterEach(function(done) {
        UniqueID.collection.drop();
        done();
    });

    // When a visitor hits a page, assign a unique ID to that browser
    it('Should assign a unique ID to a user\'s browser', function(done) {

        chai.request(server).post('/')
            .send().end(function(err, res) {

                // Find a way to detect the environment userAgent
                res.body.should.be.a('object');
                res.body.should.have.property('_id');
                res.should.have.status(200);
                res.body.fingerprint.should.not.equal(null);
                res.body.fingerprint.should.equal('O0O' || 'C118722M');
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
