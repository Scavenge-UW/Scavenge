const { promisify } = require('util');
const { execQuery } = require('../query');

exports.requireLogin = async(req, res, next) => {
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
    execQuery("select", query, [decoded.username]).then(result => {
      if (!result) {
        return res.status(200).json({ message: "User is invalid!"} );
      }

      // Verified
      req.user = result[0];
      next();
    }).catch(err => {
      console.log(err);
      return res.status(200).json({ message: "Token is invalid!"} );
    });
  } else if (req.headers['x-access-token'] || req.headers['authorization']) {
    let token = req.headers['x-access-token'] || req.headers['authorization']; 

    // Remove Bearer from string
    token = token.replace(/^Bearer\s+/, "");

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        // Token is not valid
        return res.status(200).json({ message: "User is not signed in."} );
      } else {
        // User is signed in, but we need to check if the username still exists
        const query = `
          SELECT * FROM user WHERE username = ?;
        `;
        execQuery("select", query, [decoded.username]).then(result => {
          if (!result) {
            return res.status(200).json({ message: "User is invalid!"} );
          }
          req.user = result[0]; 
          // Verified
          next();
        }).catch(err => {
          console.log(err);
          return res.status(200).json({ message: "Token is invalid!"} );
        });
      }
    });
  } else {
    // no jwt token found
    return res.status(200).json({ message: "You need to be signed in to perform that action."} );
  }
}

// Use after requireLogin
exports.verifyUsername = async (req, res, next) => {

}

// Use after requireLogin
exports.getUserType = async (req, res, next) => {

}
