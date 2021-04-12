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
describe('Pantries', () => {
  before( async () => {
    globalUseTestDB = 1;
    await(db.deleteAllDataAction());

    // Login as Sean who is an staff of pantry 1
    await(agent
      .post('/login')
      .send({
        username: "sean1",
        password: "abc"
      })
    );
  });

  // beforeEach((done) => { 
  //       done();
  // });

  /*
  * Test the /pantries GET route
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
  * Test the /pantries/:pantry_id GET route
  */
  describe('Get pantry details', () => {
    it('it should GET the pantry details', async () => {
      let data = await(agent.get('/pantries/1'));
      assert.equal(data.status, 200, "status was not 200");
      assert.instanceOf(data, Object, "data is not an object");
      data = JSON.parse(data.text);
      //console.log(data);
      const length = Object.keys(data).length;
      assert.equal(length, 15, "The pantry details does not have 15 keys");
    });
  });

  /*
  * Test the /pantries/:pantry_id PUT route
  */
  describe('Update pantry details', () => {
    it('it should update the pantry details', async () => {
      // Reset pantry 
      let data = await(agent
        .put('/pantries/1')
        .send({
          "name": "New Pantry Name",
          "address": "New Address",
          "city": "New City",
          "state": "New State",
          "zip": "12345",
          "phone_number": "new phone number",
          "details": "new pantry details",
          "img_src": "new.img_src.png",
          "lon": "99.99",
          "lat": "99.99",
          "website": "www.new-website.com"
        })
      );
      
      // Update it with new info
      const newPantryInfo = {
        "name": "The River Food Pantry_updated",
        "address": "2201 Darwin Rd",
        "city": "Madison",
        "state": "WI",
        "zip": 53704,
        "phone_number": "6084428815",
        "details": "Here to serve!",
        "img_src": "https://lh5.googleusercontent.com/p/AF1QipM6UYI64xgIkJx1w_t7RLh8eVCjelB9ogeoW_A3=w426-h240-k-no",
        "lat": -89.4,
        "lon": 43.07,
        "website": "https://www.riverfoodpantry.org/"
      }

      data = await(agent
        .put('/pantries/1')
        .send(newPantryInfo)
      );

      assert.equal(data.status, 200, "status was not 200");
      assert.instanceOf(data, Object, "data is not an object");
      data = JSON.parse(data.text);
      const affectedRows = data.affectedRows;
      assert.equal(affectedRows, 1, "There should only be one affected row.");

      // Get the updated pantry info
      data = await(chai.request(server).get('/pantries/1'));
      data = JSON.parse(data.text);
      delete data['foods'];
      delete data['hours'];
      delete data['reservations'];
      delete data['pantry_id'];
      assert.deepEqual(data, newPantryInfo, "Pantry was not updated correctly");
    });
  });

  /*
  * Test the /pantries/:pantry_id/hours/:day PUT route
  */
  describe('Update pantry hours', () => {
    it('it should update the pantry hours', async () => {
      // Reset hours
      let data = await(agent
        .put('/pantries/1/hours/1')
        .send({
          "day": "1",
          "open": "3:00:00",
          "close": "5:30:00",
          "detail": "By Appointment Only"
        })
      );     
      
      // Update hours
      const updatedHours = {
        "day": 1,
        "open": "05:00:00",
        "close": "08:30:00",
        "detail": "By Appointment Only_updated"
      };
      data = await(agent
        .put('/pantries/1/hours/1')
        .send(updatedHours)
      );     
      
      assert.equal(data.status, 200, "status was not 200");
      assert.instanceOf(data, Object, "data is not an object");
      data = JSON.parse(data.text);
      const affectedRows = data.affectedRows;
      assert.equal(affectedRows, 1, "There should only be one affected row.");

      // Check new hours by getting pantry details
      data = await(agent.get('/pantries/1'));
      assert.equal(data.status, 200, "status was not 200");
      assert.instanceOf(data, Object, "data is not an object");
      data = JSON.parse(data.text);
      //console.log(data);
      const mondayHours = data.hours[0];
      assert.deepEqual(mondayHours, updatedHours, "The hours did not update correctly");
    });
  });

  /*
  * Test the /pantries/search/ GET route
  */
  describe('Search pantries by food', () => {
    it('it should find all pantries with the foods', async () => {
      // Reset inventory
      let data = await(agent
        .post('/pantries/search/')
        .send({
          "foods": ["Apple"]
        })
      );       
      
      assert.equal(data.status, 200, "status was not 200");
      assert.instanceOf(data, Object, "data is not an object");
      numPantriesFound = Object.keys(JSON.parse(data.text)).length;
      assert.equal(numPantriesFound, 1, "There should be 1 pantry found");
    });
  });

  /*
  * Test the /pantries/:pantry_id/:food_id PUT route
  */
  describe('Update food inventory', () => {
    it('it should update the food inventory', async () => {
      // Reset inventory
      let data = await(agent
        .put('/pantries/1/46')
        .send({
          "quantity": "25"
        })
      );     
      
      // Update inventory
      
      data = await(agent
        .put('/pantries/1/46')
        .send({
          "quantity": "20"
        })
      );     
      
      assert.equal(data.status, 200, "status was not 200");
      assert.instanceOf(data, Object, "data is not an object");

      // Check new inventory by getting pantry details
      data = await(agent.get('/pantries/1'));
      assert.equal(data.status, 200, "status was not 200");
      assert.instanceOf(data, Object, "data is not an object");
      data = JSON.parse(data.text);
      //console.log(data);
      const appleInventory = data.foods[0].quantity;
      assert.equal(appleInventory, "20", "The inventory did not update correctly.");
    });
  });

  after((done) => {
    globalUseTestDB = 0;
    done();
  });

});