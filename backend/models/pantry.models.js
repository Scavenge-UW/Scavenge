const { execQuery } = require('../query');

exports.getPantryDetail = async (req, res) => {
  const query = `
    SELECT * FROM pantry
    WHERE pantry.id = ?;
  `;
  const values = [[req.params.pantry_id]];
  return await execQuery("select", query, values);
}