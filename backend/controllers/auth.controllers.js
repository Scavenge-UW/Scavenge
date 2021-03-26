const db = require("../models/auth.models.js");
const db1 = require("../models/user.models.js");

exports.loginAction = (req, res) => {
  const user = {
    "username": req.body.username,
    "password": req.body.password
  };

  if (!user.username || !user.password || user.username === "" || user.password === "") {
    return res.status(200).json({
      message: "Please provide a username and password."
    });
  }

  db.login(req, res, user)
    .then(async (results) => {
      // Resolve case
      if (!results[0] || (!await bcrypt.compare(req.body.password, results[0].password))) {
        // Wrong password
        return res.status(200).json({
          message: "Username or password is incorrect."
        });
      } else {
        // Successful login
        const username = results[0].username;

        // Create JWT token
        const token = jwt.sign({
          username: username
        }, process.env.JWT_SECRET, {
          expiresIn: process.env.JWT_EXPIRES_IN
        });

        // Create cookie
        const cookieOptions = {
          expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
          ),
          httpOnly: true
        }

        // can specify any name for cookie - insert cookie
        res.cookie('jwt', token, cookieOptions);

        console.log(token);
        //console.log(results[0]);

        // get employee-of status
        try {
          pantries = await(db1.isEmployeeOf(req, res, user));
        } catch (e) {
          console.log(e);
          return res.status(500).json({
            messsage: "Employee of pantries lookup failed due to server error."
          });
        }
        
        // make into array
        var pantriesArr = [];
        pantries.forEach((obj, index) => {
          pantriesArr[index] = obj['pantry_id'];
        })

        return res.status(200).json({
          username: username,
          token: token,
          profile: {
            username: results[0].username, firstName: results[0].first_name, lastName: results[0].last_name,
            email: results[0].email, phone: results[0].phone, address: results[0].address, city: results[0].city, 
            state: results[0].state, zipcode: results[0].zipcode, type: results[0].type
          },
          employee_of: pantriesArr
        });
      }
    })
    .catch((err) => {
      // Reject case
      console.log(err);
      return res.status(500).json({
        messsage: "Login failed due to server error."
      });
    });
};

exports.signupAction = (req, res) => {
  const newUser = {
    "username": req.body.username,
    "password": req.body.password,
    "firstName": req.body.firstName,
    "lastName": req.body.lastName,
    "email": req.body.email,
    "phone": req.body.phone,
    "address": req.body.address,
    "city": req.body.city,
    "state": req.body.state,
    "zipcode": req.body.zipcode
  };

  if (!newUser.username || !newUser.password || newUser.username === "" || newUser.password === "") {
    return res.status(200).json({
      message: "Please provide a username and password."
    });
  }

  db.signup(req, res, newUser)
    .then(async (data) => {
      // create token and insert cookie
      const token = jwt.sign({
        username: newUser.username
      }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
      });

      const cookieOptions = {
        expires: new Date(
          Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
        ),
        httpOnly: true
      }

      // can specify any name for cookie
      // need to decode the token to get username
      res.cookie('jwt', token, cookieOptions);

      console.log(token);

      // get type
      try {
        var userType = await(db.getType(req, res, newUser));
      } catch (error) {
        console.log(error);
        return res.status(500).json({
          messsage: "Employee type lookup failed due to server error."
        });
      }
      var uType = userType[0].type

      
      // get employee-of status
      // this will always return an empty array for signup because a new user cannot immediately be an employee
      try {
        var pantries = await(db1.isEmployeeOf(req, res, newUser));
      } catch (err) {
        console.log(err);
        return res.status(500).json({
          messsage: "Employee of pantries lookup failed due to server error."
        });
      }
      
      // make into array
      var pantriesArr = [];
      pantries.forEach((obj, index) => {
        pantriesArr[index] = obj['pantry_id'];
      })

      return res.status(200).json({
        username: newUser.username,
        token: token,
        profile: {
          username: newUser.username, firstName: newUser.firstName, lastName: newUser.lastName, email: newUser.email,
          phone: newUser.phone, address: newUser.address, city: newUser.city, state: newUser.state, zip: newUser.zipcode, type: uType
        },
        employee_of: pantriesArr
      });
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({
        message: "Failed to register user due to server error."
     });
    });
};

exports.updateUserAction = (req, res) => {
  const newInfo = {
    "username": req.body.username,
    "password": req.body.password,
    "firstName": req.body.firstName,
    "lastName": req.body.lastName,
    "email": req.body.email,
    "phone": req.body.phone,
    "address": req.body.address,
    "city": req.body.city,
    "state": req.body.state,
    "zipcode": req.body.zipcode
  };

  if (!newInfo.username || !newInfo.password || newInfo.username === "" || newInfo.password === "") {
    return res.status(200).json({
      message: "Please provide a username and password."
    });
  }

  db.updateUser(req, res, newInfo)
    .then(async (data) => {
      // create token and insert cookie
      const token = jwt.sign({
        username: newInfo.username
      }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
      });

      const cookieOptions = {
        expires: new Date(
          Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
        ),
        httpOnly: true
      }

      // can specify any name for cookie
      // need to decode the token to get username
      res.cookie('jwt', token, cookieOptions);

      console.log(token);

      // get type
      try {
        var userType = await(db.getType(req, res, newInfo));
      } catch (error) {
        console.log(error);
        return res.status(500).json({
          messsage: "Employee type lookup failed due to server error."
        });
      }
      var uType = userType[0].type

      
      // get employee-of status
      // this will always return an empty array for signup because a new user cannot immediately be an employee
      try {
        var pantries = await(db1.isEmployeeOf(req, res, newInfo));
      } catch (err) {
        console.log(err);
        return res.status(500).json({
          messsage: "Employee of pantries lookup failed due to server error."
        });
      }
      
      // make into array
      var pantriesArr = [];
      pantries.forEach((obj, index) => {
        pantriesArr[index] = obj['pantry_id'];
      })

      return res.status(200).json({
        username: newInfo.username,
        token: token,
        profile: {
          username: newInfo.username, firstName: newInfo.firstName, lastName: newInfo.lastName, email: newInfo.email, 
          phone: newInfo.phone, address: newInfo.address, city: newInfo.city, state: newInfo.state, zipcode: newInfo.zipcode, type: uType
        },
        employee_of: pantriesArr
      });
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({
        message: "Failed to update user due to server error."
     });
    });
};

exports.deleteUserAction = (req, res) => {
  db.deleteUser(req, res)
    .then((data) => {
      //set cookie to user logged out
      res.cookie('jwt', 'logout', {
        expires: new Date(Date.now() + 2 * 1000),
        httpOnly: true
      });

      return res.status(200).json({
        message: "User account deleted."
      });
    })
    .catch((err) => {
      return res.status(500).json({
        message: "Failed to delete user due to server error."
      });
    });
};

exports.logoutAction = (req, res) => {
  res.cookie('jwt', 'logout', {
    expires: new Date(Date.now() + 2 * 1000),
    httpOnly: true
  });
  return res.status(200).json({
    message: "Successfully logged out!"
  });
};

