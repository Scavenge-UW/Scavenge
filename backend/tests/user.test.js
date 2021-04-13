const assert = require('chai').assert;
const server = require('../../server');
const db = require("../controllers/db.controllers.js");
const food = require("../controllers/food.controllers.js");
const pantry = require("../controllers/pantry.controllers.js");

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');

chai.use(chaiHttp);

// Agent is necessary to save cookies
const agent = chai.request.agent(server);

//Our parent block
describe('User', async () => {
  before( async () => {
    globalUseTestDB = 1;
    await(db.deleteAllDataAction())
    // user 'sean1' and pantry 1 are not deleted

     // Login as Sean to pass middleware checks
     await(agent
      .post('/login')
      .send({
        username: "sean1",
        password: "abc"
      })
    );
  })

  // beforeEach((done) => { 
  //       done();
  // });

  // Error test
  it('should 404', (done) => {
    agent
      .post('/user/sean1/wishlist') //invalid route
      .end((err, res) => {
        var expected = 404;
        assert.deepEqual(res.status, expected, "response did not match expected.")
        done();
      })
  })

  // Test Make a reservation
  it('res should fail quantity check', (done) => {
    (agent
      .post('/reserve/1')
      .send({
        "username": "sean1",
        "estimated_pick_up": "2021-03-30 12:00:00",
        "food_ids": [46],
        "quantities": [100]   
      })
      .end((err, res) => {
        var expected = { message: "Quantity check failed. Not enough quantity of food_id: 46." }
        assert.deepEqual(JSON.parse(res.text), expected, "response did not match expected.")
        done();
      })
    );
  });

  it('res should succeed', (done) => {
    (agent
      .post('/reserve/1')
      .send({
        "username": "sean1",
        "estimated_pick_up": "2021-03-30 11:00:00",
        "food_ids": [46],
        "quantities": [1]   
      })
      .end((err, res) => {
        var expected = { message: "Reservation Successful. All dependent tables updated." }
        assert.deepEqual(JSON.parse(res.text), expected, "response did not match expected.")
        done();
      })
    );
  });

  // Add item to wishlist
  it('should add item to wishlist', (done) => {
    agent
      .post('/user/sean1/wishlist/add')
      .send({
        "food_id": 46,
        "pantry_id": 1
      })
      .end((err, res) => {
        var expected = 1;
        assert.deepEqual(JSON.parse(res.text)['affectedRows'], expected, "response did not match expected.")
        done();
      })
  })

  var wishlistID;
  // Get user's wishlist
  it('get user\'s wishlist', (done) => {
    agent
      .get('/user/sean1/wishlist')
      .end((err, res) => {
        var result = JSON.parse(res.text);
        wishlistID = (result[0]['foods'][0]['wishlist_id']);
        assert.deepEqual(result[0]['pantry_id'], 1, "pantry_id did not match expected.");
        assert.deepEqual(result[0]['foods'][0]['food_name'], "Apple", "food did not match expected.");
        done();
      })
  })

  // Remove from user's wishlist
  it('deletes from wishlist', (done) => {
    agent
      .delete('/user/sean1/wishlist/remove/' + wishlistID)
      .end((err, res) => {
        var result = JSON.parse(res.text);
      //  console.log(result);
        assert.deepEqual(result['affectedRows'], 1, "affected rows did not match expected");
        done();
      })
  })

  // AFTER ALL
  after((done) => {
    globalUseTestDB = 0;
    agent.close();
    done();
  })


});