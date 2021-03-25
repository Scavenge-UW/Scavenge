const { execQuery } = require('../query');

exports.isEmployeeOf = async (req, res, user) => {
  // User fields already validated
  const query = `
    SELECT pantry_id
    FROM user_to_pantry
    WHERE username = ?;
  `;
  var values = [
    [user.username]
  ];

  const results = await execQuery("select", query, values);
  return results;
}