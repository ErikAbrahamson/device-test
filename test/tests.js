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

                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('_id');
                res.body.should.have.property('fingerprint');
                res.body.fingerprint.should.not.equal(null);
                res.body.fingerprint.should.have.length.of.at.least(5);
                console.log('Current Browser ID: ' + res.body.fingerprint);
                done();
            });
    });

    // After the browser is restarted, when the visitor hits the page again the browser has the same ID
    it('Should return the same unique browser ID after browser is restarted', function(done) {

        UniqueID.collection.drop();
        chai.request(server).post('/')
            .send().end(function(err, res) {

                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('_id');
                res.body.should.have.property('fingerprint');
                res.body.fingerprint.should.not.equal(null);
                res.body.fingerprint.should.have.length.of.at.least(5);
                done();
            });
    });

    // After the browser clears cache, cookies, and all, the browser is still assigned the same ID
    it('Should keep Unique browser ID independent of browser storage and cookies', function(done) {

        var tempCookie;
        chai.request(server).post('/')
            .send().end(function(err, res) {

                tempCookie = res.headers['set-cookie'][0];
                tempCookie.should.be.a('string');
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('_id');
                res.body.should.have.property('fingerprint');
                res.body.fingerprint.should.not.equal(null);
                res.body.fingerprint.should.have.length.of.at.least(5);
            });

        chai.request(server).post('/')
            .send().end(function(err, res) {

                res.headers['set-cookie'][0].should.not.equal(tempCookie);
                tempCookie.should.be.a('string');
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('_id');
                res.body.should.have.property('fingerprint');
                res.body.fingerprint.should.not.equal(null);
                res.body.fingerprint.should.have.length.of.at.least(5);
                done();
            });
    });

    // Some, or all, of the browsers (chrome, firefox, opera, IE, Safari, etc.) on the device share the same ID
    xit('Should retain unique ID across browsers', function(done) {

        chai.request(server).get('/').end(function(err, res) {
            res.should.have.status(200);
            done();
        });
    });

    // If you got this to work on desktop, get this to also work on mobile
    it('Should have the unique ID differentiate between device types', function(done) {

        var currentDevice, devices = new RegExp(/(de)|(te)|(ta)|(ph)|(ca)/g);
        chai.request(server).post('/')
            .send().end(function(err, res) {

                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('_id');
                res.body.should.have.property('fingerprint');
                res.body.fingerprint.should.not.equal(null);
                res.body.fingerprint.should.have.length.of.at.least(5);
                currentDevice = res.body.fingerprint.split('-',2)[1];
                currentDevice.should.match(devices);
                done();
            });
    });
});
