const { execQuery } = require('../query');

exports.getPantryDetail = async (req, res) => {
  const query = `
    SELECT 
      p.id as pantry_id,
      p.name,
      p.address,
      p.zip,
      p.city,
      p.state,
      p.phone_number,
      p.details,
      p.img_src,
      p.lon,
      p.lat,
      p.website,
      f.id as food_id,
      f.name as food_name,
      f.qr_code,
      i.quantity,
      r.id as reservation_id,
      r.username,
      r.order_time,
      r.estimated_pick_up,
      r.picked_up_time,
      r.approved,
      r.cancelled
    FROM pantry p
    JOIN inventory i ON p.id = i.pantry_id
    JOIN food f ON f.id = i.food_id
    LEFT JOIN reservation r ON r.pantry_id = p.id
    WHERE p.id = ?;
  `;
  const values = [[req.params.pantry_id]];
  return await execQuery("select", query, values);
}