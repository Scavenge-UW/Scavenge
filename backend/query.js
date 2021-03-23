// Wrapper for making a query

const mysql = require('mysql');
require('dotenv').config();

// DB Connection
const db_config = {
  host: 'scavenge-db.clkbasnuzdfc.us-east-2.rds.amazonaws.com',
  user: 'admin',
  password: process.env.DB_PASSWORD,
  database: 'ScavengeDB',
  connectionLimit: 10
}; 
const pool = mysql.createPool(db_config);

// Values params is optional
exports.execQuery = (type, query, values = [[]]) => {
  return new Promise((resolve, reject) => {
    // Connect to database
    pool.getConnection((err, connection) => {
      if (err) {
        console.log("Error connecting to database!");
        return reject(err);
      } else {
        if (type === 'select' || type === 'insert') {
          connection.query(query, [values], async (error, results) => {
            // Always release the connection back
            connection.release();
    
            if (error) {
              console.log("Error in query!");
              return reject(error);
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
              return reject(error);
            } else {
              return resolve(results);
            }
          });
        } else {
          return reject({ msg: "The first parameter must be 'select', 'insert', 'update', or 'delete'" });
        }
      }
    });
  });
}