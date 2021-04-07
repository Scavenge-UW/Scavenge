const assert = require('chai').assert;
const server = require('../../server');

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();

chai.use(chaiHttp);

//Our parent block
describe('Pantries', () => {
  beforeEach((done) => { //Before each test we should empty the test database
        done();
  });

  /*
  * Test the /pantries route
  */
  describe('/pantires pantries', () => {
      it('it should GET all the pantries', (done) => {
        chai.request(server)
            .get('/pantries')
            .end((err, res) => {
                  res.should.have.status(200);
                  res.body.should.be.a('object');
                  //res.body.length.should.be.eql(0);
              done();
            });
      });
  });



});