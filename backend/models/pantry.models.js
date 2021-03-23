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

exports.pantryUpdateInventory = async (req, res) => {
  const query = `
    REPLACE INTO inventory(pantry_id, food_id, quantity)
    VALUES (?);
  `;
  const values = [req.params.pantry_id, req.params.food_id, req.body.quantity];
  return await execQuery("replace", query, values, "Failure - nonexistent pantry or food");
}

exports.pantryUpdateDetail = async (req, res) => {
  const query = `
    UPDATE pantry
    SET
      name = ?,
      address = ?,
      city = ?,
      state = ?,
      zip = ?,
      phone_number = ?,
      details = ?,
      img_src = ?,
      lon = ?,
      lat = ?,
      website = ?
    WHERE id = ?;
  `;
  const values = [req.body.name, req.body.address, req.body.city, req.body.state, req.body.zip,
    req.body.phone_number, req.body.details, req.body.img_src, req.body.lon, req.body.lat, 
    req.body.website, req.params.pantry_id];
  return await execQuery("update", query, values, "Update failed due to server error");
}

exports.completeReservation = async (req, res) => {
  const query = `
    UPDATE reservation
    SET
      picked_up_time = NOW()
    WHERE id = ? AND pantry_id = ?;
  `;
  // pantry_id is determined by id, but since it's in the route we'll use it in the query
  // as an added layer of verification
  const values = [req.params.reservation_id, req.params.pantry_id];
  return await execQuery("update", query, values, "Update failed due to server error");
}