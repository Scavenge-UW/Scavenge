const assert = require('chai').assert;
const server = require('../../server');
const db = require("../controllers/db.controllers.js");

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();

chai.use(chaiHttp);

// Agent is necessary to save cookies
const agent = chai.request.agent(server);

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
  * Test that update user info is not available while logged out
  */
  describe('update user info - logged out', () => {
    it('it should fail with message', (done) => {
      const data = (agent
        .put('/abcabc')
        .send({
            username: "abc",
            password: "abc",
            firstName: "test",
            lastName: "test",
            phone: "2",
            address: "2",
            city: "2",
            state: "2",
            zipcode: "22222",
            email: "2@2.2"
        })
        .end((err, res) => {
          var expected = { message: "You need to be signed in to perform that action." }
          assert.deepEqual(JSON.parse(res.text), expected, "response did not match expected.")
          done();
        })
      );
    });
  });

  /*
  * Test the /signup route
  */
  describe('/signup', () => {
    it('it should create a new user account', async () => {
      let data = await(agent
        .post('/signup')
        .send({
          username: 'abcabc',
          password: 'abcabc',
          firstName: 'firstname',
          lastName: 'lastname',
          phone: '123456789',
          address: 'street',
          city: 'Madison',
          state: 'wi',
          zipcode: '12345',
          email: 'email@wisc.edu'
        })
      );
        assert.equal(data.status, 200, "status was not 200");
        assert.instanceOf(data, Object, "data is not an object");
    });
  });

  /*
  * Test the /logout route
  */
  describe('/logout', () => {
    it('should log the user out', async () => {
      let data = await(agent
        .post('/logout')
      );
        assert.equal(data.status, 200, "status was not 200");
        assert.instanceOf(data, Object, "data is not an object");
        var res = JSON.parse(data.res.text);
        var expected = { message: 'Successfully logged out!' };
        assert.deepEqual(res, expected, "json result does not match expected")
    });
  });
  
  /*
  * Test the /login route
  */
  describe('/login', () => {
    it('it should log the user in', async () => {
      let data = await(agent
        .post('/login')
        .send({
          username: "abcabc",
          password: "abcabc"
        })
      );
        assert.equal(data.status, 200, "status was not 200");
        assert.instanceOf(data, Object, "data is not an object");
        var res = JSON.parse(data.res.text);
        assert.equal(res['profile']['username'], "abcabc", "username did not match");
        assert.equal(res['profile']['type'], "user", "type is incorrect");  
    });
  });

  /*
  * Test the update user info route
  */
  describe('update user info', () => {
    it('it should change the user\'s information', async () => {
      let data = await(agent
        .put('/abcabc')
        .send({
            "username": "abc",
            "password": "abc",
            "firstName": "test",
            "lastName": "test",
            "phone": "2",
            "address": "2",
            "city": "2",
            "state": "2",
            "zipcode": "22222",
            "email": "2@2.2"
        })
      );
        assert.equal(data.status, 200, "status was not 200");
        assert.instanceOf(data, Object, "data is not an object");
        var res = JSON.parse(data.res.text);
        var expected = {
          username: 'abc',
          firstName: 'test',
          lastName: 'test',
          email: '2@2.2',
          phone: '2',
          address: '2',
          city: '2',
          state: '2',
          zipcode: '22222',
          type: 'user'
        }
        assert.deepEqual(res['profile'], expected, "json result does not match expected");
    });
  });

  /*
  * Test the /delete user route
  */
  describe('delete user', () => {
    it('should delete user', (done) => {
      const data = (agent
        .delete('/abc')
        .end((err, res) => {
          var expected = { message: "User account deleted." }
          assert.deepEqual(JSON.parse(res.text), expected, "response did not match expected.")
          done();
        })
      );
    });
  });

  // AFTER ALL
  after((done) => {
    globalUseTestDB = 0;
    agent.close();
    done();
  })


});