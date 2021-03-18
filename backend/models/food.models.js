const { execQuery } = require('../query');

exports.getAllFoods = async (req, res) => {
  const query = `
    SELECT * FROM food;
  `;
  return await execQuery("select", query);
}