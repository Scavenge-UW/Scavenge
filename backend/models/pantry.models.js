const { execQuery } = require('../query');

exports.getAllPantries = async (req, res) => {
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
      p.approved,
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
      r.cancelled,
      f2.id as res_food_id,
      f2.name as res_food_name,
      rf.quantity as res_food_quantity,
      h.id as hours_id,
      h.day,
      h.open,
      h.close,
      h.detail      
    FROM pantry p
    LEFT JOIN inventory i ON p.id = i.pantry_id
    LEFT JOIN food f ON f.id = i.food_id
    LEFT JOIN reservation r ON r.pantry_id = p.id
    LEFT JOIN res_food rf ON r.id = rf.reservation_id
    LEFT JOIN food f2 on rf.food_id = f2.id
    JOIN hours h ON p.id = h.pantry_id;
  `;
  return await execQuery("select", query);
}

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
      p.approved,
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
      r.cancelled,
      f2.id as res_food_id,
      f2.name as res_food_name,
      rf.quantity as res_food_quantity,
      h.id as hours_id,
      h.day,
      h.open,
      h.close,
      h.detail      
    FROM pantry p
    LEFT JOIN inventory i ON p.id = i.pantry_id
    LEFT JOIN food f ON f.id = i.food_id
    LEFT JOIN reservation r ON r.pantry_id = p.id
    LEFT JOIN res_food rf ON r.id = rf.reservation_id
    LEFT JOIN food f2 on rf.food_id = f2.id
    JOIN hours h ON p.id = h.pantry_id
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
  return await execQuery("replace", query, values);
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
  return await execQuery("update", query, values);
}

exports.getPantryHours = async (req, res) => {
  const query = `
    SELECT
      h.id as hours_id,
      h.pantry_id,
      h.day,
      h.open,
      h.close,
      h.detail
    FROM hours h
    JOIN pantry p ON p.id = h.pantry_id
    WHERE h.pantry_id = ?;
  `;
  const values = [[req.params.pantry_id]];
  return await execQuery("select", query, values);
}

exports.pantryUpdateHours = async (req, res) => {
  const query = `
    UPDATE hours
    SET
      day = ?,
      open = ?,
      close = ?,
      detail = ?
    WHERE day = ? AND pantry_id = ?;
  `;
  const values = [req.body.day, req.body.open, req.body.close, req.body.detail,
    req.params.day, req.params.pantry_id];
  return await execQuery("update", query, values);
}

exports.updateReservation = async (req, res) => {
  if (req.params.action === 'complete') {
    const query = `
      UPDATE reservation
      SET
        picked_up_time = NOW()
      WHERE id = ? AND pantry_id = ?;
    `;
    // pantry_id is determined by id, but since it's in the route we'll use it in the query
    // as an added layer of verification
    const values = [req.params.reservation_id, req.params.pantry_id];
    return await execQuery("update", query, values);
  } else if (req.params.action === 'approve') {
    const query = `
      UPDATE reservation
      SET
        cancelled = 0,
        approved = 1
      WHERE id = ? AND pantry_id = ?;
    `;
    const values = [req.params.reservation_id, req.params.pantry_id];
    return await execQuery("update", query, values);
  } else if (req.params.action === 'cancel') {
    const query = `
      UPDATE reservation
      SET
        approved = 0,
        cancelled = 1
      WHERE id = ? AND pantry_id = ?;
    `;
    const values = [req.params.reservation_id, req.params.pantry_id];
    return await execQuery("update", query, values);
  } else {
    console.log('Invalid action. Please use action: "complete", "approve", or "cancel".');
    throw new Error('Invalid action. Please use action: "complete", "approve", or "cancel".');
  }
}

exports.foodSearch = async (req, res) => {
  const query = `
    SELECT
      i.pantry_id,
      i.food_id,
      i.quantity
    FROM inventory i
    WHERE i.food_id = ?;
  `;
  const values = [[req.params.food_id]];
  return await execQuery("select", query, values);
}

// Get food from a reservation for use in cancelling a reservation
exports.getResFood = async (req, res) => {
  const query = `
    SELECT
      food_id,
      quantity
    FROM res_food
    WHERE reservation_id = ?;
  `;
  const values = [[req.params.reservation_id]];
  return await execQuery("select", query, values);
}

// add food back to inventory
exports.cancelReservation = async (req, res, food_id, quantity) => {
  const query = `
    UPDATE inventory
    SET
      quantity = quantity + ?
    WHERE food_id = ? AND pantry_id = ?
  `;
  const values = [quantity, food_id, req.params.pantry_id];
  return await execQuery("update", query, values);
}