// Wrapper for making a query

const mysql = require('mysql');
require('dotenv').config();

// DB Connection
const db_config = {
  host: 'scavenge-db.clkbasnuzdfc.us-east-2.rds.amazonaws.com',
  user: 'admin',
  password: process.env.DB_PASSWORD,
  database: 'ScavengeDB_IT2',
  connectionLimit: 10
}; 

// TEST DB Connection
const test_db_config = {
  host: 'scavenge-db.clkbasnuzdfc.us-east-2.rds.amazonaws.com',
  user: 'admin',
  password: process.env.DB_PASSWORD,
  database: 'ScavengeDB_TEST',
  connectionLimit: 10
}; 

const pool = mysql.createPool(db_config);
const test_pool = mysql.createPool(test_db_config);


// Values params is optional
exports.execQuery = (type, query, values = [[]], failure="No failure message provided.") => {
  return new Promise((resolve, reject) => {
    // Connect to database
    (globalUseTestDB == 1 ? test_pool : pool).getConnection((err, connection) => {
      if (err) {
        console.log("Error connecting to database!");
        console.log(err);
        return reject(err);
      } else {
        if (type === 'select' || type === 'insert' || type === "replace") {
          connection.query(query, [values], async (error, results) => {
            // Always release the connection back
            connection.release();
    
            if (error) {
              console.log("Error in query!");
              console.log(error);
              return reject({err: error, failureMsg: failure});
            } else {
              return resolve(results);
            }
          });
        } else if (type === "update" || type === "delete") {
          connection.query(query, values, async (error, results) => {
            // Always release the connection back
            connection.release();
    
            if (error) {
              console.log("Error in query!");
              console.log(error);
              return reject({err: error, failureMsg: failure});
            } else {
              return resolve(results);
            }
          });
        } else {
          return reject({ msg: "The first parameter must be 'select', 'insert', 'update', 'replace', or 'delete'" });
        }
      }
    });
  });
}