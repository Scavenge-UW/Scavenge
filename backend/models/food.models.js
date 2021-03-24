const { execQuery } = require('../query');

exports.getAllFoods = async (req, res) => {
  const query = `
    SELECT * FROM food;
  `;
  return await execQuery("select", query);
}

exports.addFood = async (req, res) => {
  const query = `
    INSERT INTO food (name, qr_code)
    VALUES ?;
  `;
  let values = [[req.body.food_name, req.body.qr_code]]
  return await execQuery("insert", query, values);
}