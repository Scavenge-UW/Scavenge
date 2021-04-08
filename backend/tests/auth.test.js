const assert = require('chai').assert;
const server = require('../../server');
const db = require("../controllers/db.controllers.js");

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();

chai.use(chaiHttp);

//Our parent block
describe('Auth', () => {
  before( async () => {
    globalUseTestDB = 1;
    let data = await(db.deleteAllDataAction());
  });

  beforeEach((done) => { //Before each test we should empty the test database
        done();
  });

  /*
  * Test the /signup route
  */
  describe('/signup', () => {
    it('it should create a new user account', async () => {
      let data = await(chai.request(server)
        .post('/signup')
        .send({
          username: "abcabc",
          password: "abcabc",
          firstName: "sean",
          lastName: "cunningham",
          phone: "sean's phone",
          address: "street",
          city: "city",
          state: "wi",
          zipcode: "53706",
          email: "sjcunningham@wisc.edu"
        })
      );
        assert.equal(data.status, 200, "status was not 200");
        assert.instanceOf(data, Object, "data is not an object");
            //res.body.length.should.be.eql(0);
    });
  });

  after((done) => {
    globalUseTestDB = 0;
    done();
  })


});