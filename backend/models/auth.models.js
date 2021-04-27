const { execQuery } = require('../query');

exports.login = async (req, res, user) => {
  // User fields already validated
  const query = `
    SELECT * 
    FROM user
    WHERE username = ?;
  `;
  var values = [
    [user.username]
  ];

  const results = await execQuery("select", query, values);
  return results;
}

exports.getType = async (req, res, user) => {
  // User fields already validated
  const query = `
    SELECT type 
    FROM user
    WHERE username = ?;
  `;
  var values = [
    [user.username]
  ];

  const results = await execQuery("select", query, values);
  return results;
}

exports.signup = async (req, res, newUser) => {
  const query = "INSERT INTO user (username, password, first_name, last_name, email, phone, address, city, state, zipcode) VALUES ?";
  // hash password - takes awhile so we need aysnc await
  const hashedPassword = await bcrypt.hash(newUser.password, 8);
  const values = [
      [
        newUser.username, hashedPassword, newUser.firstName, newUser.lastName, newUser.email, newUser.phone, newUser.address, newUser.city, newUser.state, newUser.zipcode
      ]
    ];

  return await execQuery("insert", query, values, 'Duplicate username. Please choose another one.');
}

exports.updateUser = async (req, res, newInfo) => {
  const query = `
    UPDATE user u
    SET 
      username = ?,
      password = ?,
      first_name = ?,
      last_name = ?,
      email = ?,
      phone = ?,
      address = ?,
      city = ?,
      state = ?,
      zipcode = ?
    WHERE u.username = ?;
  `;
  // hash password - takes awhile so we need aysnc await
  const hashedPassword = await bcrypt.hash(newInfo.password, 8);
  const values = [
    newInfo.username, hashedPassword, newInfo.firstName, newInfo.lastName, newInfo.email, newInfo.phone, newInfo.address, newInfo.city, newInfo.state, newInfo.zipcode, req.params.username
  ];

  return await execQuery("update", query, values);
}

exports.deleteUser = async (req, res) => {
  const query = `
    DELETE FROM user
    WHERE username = ?;
  `;
  const values = [
    [req.params.username]
  ];

  return await execQuery("delete", query, values);
}