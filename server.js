// Global declaration. Needs to be before package imports.
var globalUseTestDB;
global.globalUseTestDB = globalUseTestDB;

// Import packages
require('dotenv').config();
const express    = require("express"),
      bodyParser = require('body-parser'),
      cors       = require("cors"),
      jwt        = require("jsonwebtoken"),
      bcrypt     = require("bcryptjs"),
      cookieParser = require("cookie-parser");

// Import routes
const foodRoutes = require('./backend/routes/food.routes');
const authRoutes = require('./backend/routes/auth.routes');
const pantryRoutes = require('./backend/routes/pantry.routes');
const userRoutes = require('./backend/routes/user.routes');

// More init
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
global.jwt = jwt;
global.bcrypt = bcrypt;



// let corsOption = {
//   origin: "http://localhost:8081",
//   credentials: true
// };

// Cors settings
// app.use(cors(corsOption));
app.use(function(req, res, next) {
  const allowedOrigins = ["http://localhost:8081", "https://scavenge-uw.herokuapp.com/"];
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  res.header("Access-Control-Allow-Credentials", true);
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Express only serves static assets in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static("frontend/build"));
  // Upon recieving reqs, send back the index.html assuming we ran 'npm build' in the frontend
  app.get('*', (req, res) => {
    res.sendFile(_dirname, 'frontend', 'build', 'index.html');
  });
}

// 'Use' routes here
app.use("/", foodRoutes);
app.use('/', authRoutes);
app.use("/", pantryRoutes);
app.use("/", userRoutes);

// Last case: url not found
app.get('/*', function(req, res){
  res.json({ message: "404 Not found" });
});

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

module.exports = app; // for testing