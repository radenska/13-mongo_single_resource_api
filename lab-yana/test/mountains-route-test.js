'use strict';

const expect = require('chai').expect;
const request = require('superagent');
const Mountains = require('../model/mountains.js');
const url = 'http://localhost:3004';

require ('../server.js');

const testMountain = {
  name: 'test mountain name'
};

const newInfo = {
  name: 'new info'
};

describe('Mountains Routes', function() {
  describe('unregistered routes', function() {
    it('should return a 404 not found', done => {
      request.get(`${url}/someWrongRoute`)
      .end((err, res) => {
        expect(res.status).to.equal(404);
        expect(res.body).to.be.empty();
        done();
      });
    });
  });
  describe('GET: /api/mountains/:id', function() {
    before(done => {
      testMountain.timestamp = new Date();
      new Mountains(testMountain).save()
      .then(mountains => {
        this.tempMountains = mountains;
        done();
      })
      .catch(done);
    });
    after(done => {
      delete testMountain.timestamp;
      if (this.tempMountains) {
        Mountains.remove({})
        .then( () => done())
        .catch(done);
        return;
      }
      done();
    });
    describe('with a valid body', () => {
      it('should return a mountain', done => {
        request.get(`${url}/api/mountains/${this.tempMountains._id}`)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.name).to.equal(testMountain.name);
          done();
        });
      });
    });
    describe('with an invalid id', () => {
      it('should return a 400 bad request', done => {
        request.get(`${url}/api/mountains/wrongID`)
        .end((err, res) => {
          expect(err.status).to.equal(400);
          expect(res.body).to.be.empty;
          done();
        });
      });
    });
  });
  describe('PUT: /api/mountains/:id', function() {
    before(done => {
      testMountain.timestamp = new Date();
      new Mountains(testMountain).save()
      .then(mountain => {
        this.tempMountains = mountain;
        done();
      })
      .catch(done);
    });
    after(done => {
      delete testMountain.timestamp;
      if (this.tempMountains) {
        Mountains.remove({})
        .then( () => done())
        .catch(done);
        return;
      }
      done();
    });
    describe('with a valid id and body', () => {
      it('should return a mountain', done => {
        request.put(`${url}/api/mountains/${this.tempMountains._id}`)
        .send({newInfo})
        .end((err, res) => {
          if (err) return done();
          expect(res.status).to.equal(200);
          expect(res.body.name).to.equal(newInfo.name);
          done();
        });
      });
    });
    describe('with an invalid id', () => {
      it('should return a 404 not found', done => {
        request.put(`${url}/api/mountains/invalidID`)
        .send({newInfo})
        .end((err, res) => {
          expect(err.status).to.equal(404);
          expect(res.body).to.be.empty;
          done();
        });
      });
    });
    describe('with invalid response body', () => {
      it('should return a 404 not found', done => {
        request.put(`${url}/api/mountains/${this.tempMountains._id}`)
        .end((err, res) => {
          expect(err.status).to.equal(400);
          expect(res.body).to.be.empty;
          done();
        });
      });
    });
  });
  describe('POST: /api/mountains', function() {
    after(done => {
      delete testMountain.timestamp;
      if(this.tempMountains) {
        Mountains.remove({})
        .then( () => done())
        .catch(done);
        return;
      }
      done();
    });
    describe('with no request body', function() {
      it('should return a 400 bad request', function(done) {
        request.post(`${url}/api/mountains`)
        .end((err, res) => {
          expect(err.status).to.equal(400);
          expect(res.body).to.be.empty;
          done();
        });
      });
    });
    describe('with a valid body', function() {
      it('should return a mountain', done => {
        request.post(`${url}/api/mountains`)
        .send(testMountain)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.name).to.equal(testMountain.name);
          done();
        });
      });
    });
  });
});
