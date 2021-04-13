const { promisify } = require('util');
const { execQuery } = require('../query');
const authDB = require('../models/user.models');

/*
 * Helper middleware function that verifies if a user is truly logged in.
 * Sets req.user to the user and req.employeeOf to be the ids of pantries they work for.
 * Otherwise, both will be null.
 */
exports.verifyAndGetUserInfo = async (req, res, next) => {
  if (req.cookies.jwt) {
    // async returns a promise after the await
    // verify is from jwt web tokens
    // 1. Verify the token
    const decoded = await promisify(jwt.verify)(req.
      cookies.jwt,
      process.env.JWT_SECRET
    ); 
    console.log(decoded);

    // 2. Check if the user still exists and get user info from DB
    const query = `
      SELECT * FROM user WHERE username = ?;
    `;
    execQuery("select", query, [decoded.username]).then(async (result) => {
      if (!result) {
        req.user = null;
        next();
      } else {
        // Verified user
        req.user = result[0];

        // Get pantries they work for
        const isEmployeeOf = await authDB.isEmployeeOf(req, res, {"username": req.user.username});
        let isEmployeeOfArr = [];
        isEmployeeOf.forEach(data => {
          isEmployeeOfArr.push(data['pantry_id']);
        });
        req.isEmployeeOf = isEmployeeOfArr;
        next();
      }
    }).catch(err => {
      console.log(err);
      req.user = null;
      return res.status(500).json({ message: "Server error" });
    });
  } else if (req.headers['x-access-token'] || req.headers['authorization']) {
    let token = req.headers['x-access-token'] || req.headers['authorization']; 

    // Remove Bearer from string
    token = token.replace(/^Bearer\s+/, "");

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        // Token is not valid
        req.user = null;
        next();
      } else {
        // User is signed in, but we need to check if the username still exists
        const query = `
          SELECT * FROM user WHERE username = ?;
        `;
        execQuery("select", query, [decoded.username]).then(async (result) => {
          if (!result) {
            req.user = null;
            next();
          }
          // Got login info and user if verified
          req.user = result[0]; 

          // Get pantries they work for
          const isEmployeeOf = await authDB.isEmployeeOf(req, res, {"username": req.user.username});
          let isEmployeeOfArr = [];
          isEmployeeOf.forEach(data => {
            isEmployeeOfArr.push(data['pantry_id']);
          });
          req.isEmployeeOf = isEmployeeOfArr;
          next();
        }).catch(err => {
          console.log(err);
          req.user = null;
          return res.status(500).json({ message: "Server error" });
        });
      }
    });
  } else {
    // no jwt token found
    req.user = null;
    next();
  }
}

exports.requireLogin = async (req, res, next) => {
  if (req.user) {
    next();
  } else {
    return res.status(200).json({ message: "You need to be signed in to perform that action."} );
  }
}

exports.verifyUsername = async (req, res, next) => {

}

exports.getUserType = async (req, res, next) => {

}
