const assert = require('chai').assert;
const server = require('../../server');
const db = require("../controllers/db.controllers.js");

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');

chai.use(chaiHttp);

// Agent is necessary to save cookies
const agent = chai.request.agent(server);

//Our parent block
describe('Food', () => {
  before( async () => {
    globalUseTestDB = 1;
    let data = await(db.deleteAllDataAction());

    // Make a user
    await(agent
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
  });

  // beforeEach((done) => { 
  //       done();
  // });

  /*
  * Test the /foods POST route
  */
  describe('Add food', () => {
    it('it should add a food', async () => {
      let data = await(agent
        .post('/foods')
        .send({
          food_name: "apple",
          qr_code: "1234"
        })
      );
        assert.equal(data.status, 200, "status was not 200");
        assert.instanceOf(data, Object, "data is not an object");
        data = JSON.parse(data.text);
        assert.equal(data.affectedRows, "1", "A food should've been added.");
    });
  });

  /*
  * Test the /foods GET route
  */
  describe('Get all foods', () => {
    it('it should retrieve all foods', async () => {
      let data = await(agent
        .get('/foods')
      );
        assert.equal(data.status, 200, "status was not 200");
        assert.instanceOf(data, Object, "data is not an object");
        data = JSON.parse(data.text);
        assert.equal(Object.keys(data).length, "2", "Length of get foods should be 2");
    });
  });

  // AFTER ALL
  after((done) => {
    globalUseTestDB = 0;
    agent.close();
    done();
  })


});