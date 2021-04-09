const assert = require('chai').assert;
const server = require('../../server');
const db = require("../controllers/db.controllers.js");

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');

chai.use(chaiHttp);

//Our parent block
describe('Pantries', () => {
  before( async () => {
    globalUseTestDB = 1;
    let data = await(db.deleteAllDataAction());
  });

  // beforeEach((done) => { 
  //       done();
  // });

  /*
  * Test the /pantries route
  */
  describe('Get all pantries', () => {
      it('it should GET all the pantries', async () => {
        let data = await(chai.request(server).get('/pantries'));
        assert.equal(data.status, 200, "status was not 200");
        assert.instanceOf(data, Object, "data is not an object");
        data = JSON.parse(data.text);
        const length = Object.keys(data).length;
        assert.equal(length, 1, "The length of pantries was not 1");
      });
  });

  /*
  * Test the /pantries/:pantry_id route
  */
    describe('Get pantry details', () => {
      it('it should GET the pantry details', async () => {
        let data = await(chai.request(server).get('/pantries/1'));
        assert.equal(data.status, 200, "status was not 200");
        assert.instanceOf(data, Object, "data is not an object");
        data = JSON.parse(data.text);
        const length = Object.keys(data).length;
        assert.equal(length, 1, "The length of pantries was not 1");
      });
  });

  after((done) => {
    globalUseTestDB = 0;
    done();
  });

});