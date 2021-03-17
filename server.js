// Import packages
require('dotenv').config();
const express    = require("express"),
      bodyParser = require('body-parser'),
      cors       = require("cors"),
      mysql      = require("mysql"),
      jwt        = require("jsonwebtoken"),
      bcrypt     = require("bcryptjs"),
      cookieParser = require("cookie-parser");

// Import routes

// More init
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
global.bcrypt = bcrypt;
global.jwt = jwt;

// let corsOption = {
//   origin: "http://localhost:8081",
//   credentials: true
// };

// app.use(cors(corsOption));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:8081"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  res.header("Access-Control-Allow-Credentials", true);
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 'Use' routes here

// Last case: url not found
app.get('/*', function(req, res){
  res.json({ message: "404 Not found" });
});

// DB Connection
const db_config = {
  host: 'scavenge-db.clkbasnuzdfc.us-east-2.rds.amazonaws.com',
  user: 'admin',
  password: process.env.DB_PASSWORD,
  database: 'ScavengeDB',
  connectionLimit: 10
}; 
const pool = mysql.createPool(db_config);
global.pool = pool;

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});