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
  return await execQuery("select", query, values);
}

exports.checkQuantity = async (req, res, food_id) => {
  const query = `
    SELECT quantity
    FROM inventory i
    WHERE i.pantry_id = ? AND i.food_id = ?;
  `;
  let values = [req.params.pantry_id, food_id];

  // needed to call this an "update" query so query.js would accept separate values arguments
  return await execQuery("update", query, values, "quantity check failed for food_id: " + food_id);
}

// Assumes inventory quantity has alredy been checked
exports.reserve = async (req, res) => {
  const query = `
    INSERT INTO reservation (username, pantry_id, order_time, estimated_pick_up)
    VALUES ?;
  `;

  // get current datetime string
  let m = new Date();
  var dateString =
      m.getUTCFullYear() + "-" +
      ("0" + (m.getUTCMonth()+1)).slice(-2) + "-" +
      ("0" + m.getUTCDate()).slice(-2) + " " +
      ("0" + (m.getUTCHours() - 5)).slice(-2) + ":" +
      ("0" + m.getUTCMinutes()).slice(-2) + ":" +
      ("0" + m.getUTCSeconds()).slice(-2);

  let values = [[req.body.username, req.params.pantry_id, dateString, req.body.estimated_pick_up]];

  return await execQuery("insert", query, values, "insert into reservation table failed");
}

exports.updateResFood = async (req, res, res_id, food_id, quantity) => {
  const query = `
    INSERT INTO res_food (reservation_id, food_id, quantity)
    VALUES ?;
  `;
  let values = [[res_id, food_id, quantity]];

  return await execQuery("insert", query, values, "insert into res_food table failed");
}

exports.updateResInventory = async (req, res, food_id, reservedQty) => {
  const query = `
    UPDATE inventory
    SET quantity = quantity - ?
    WHERE food_id = ? AND pantry_id = ?;
  `;
  let values = [reservedQty, food_id, req.params.pantry_id];

  return await execQuery("update", query, values, "insert into res_food table failed");
}

exports.addToWishlist = async (req, res) => {
  const query = `
    INSERT INTO wishlist (food_id, username, pantry_id)
    VALUES ?;
  `;
  let values = [[req.body.food_id, req.params.username, req.body.pantry_id]];

  return await execQuery("insert", query, values, 
    "insert into wishlist table failed, possible duplicate entry or invalid username/food_id");
}

exports.getWishlist = async (req, res) => {
  const query = `
    SELECT
      f.id as food_id,
      f.name as food_name,
      w.id as wishlist_id,
      w.username,
      w.pantry_id,
      h.id as hours_id,
      h.day,
      h.open,
      h.close,
      h.detail,  
      p.name as name,
      p.website,
      p.address,
      p.city,
      p.state,
      p.zip,
      p.phone_number, 
      p.img_src, 
      p.email
    FROM wishlist w
    JOIN food f ON f.id = w.food_id
    JOIN pantry p ON w.pantry_id = p.id
    JOIN hours h ON p.id = h.pantry_id
    WHERE w.username = ?;
  `;
  let values = [[req.params.username]];

  return await execQuery("select", query, values, 
    "failed to get wishlist due to server error.");
}

exports.removeFromWishlist = async (req, res) => {
  const query = `
    DELETE
    FROM wishlist w
    WHERE w.username = ? AND w.id = ?;
  `;
  let values = [req.params.username, req.params.wishlist_id];
  /* w.id determines w.username, but since it's in the route anyway
  we'll use it as a double check */

  return await execQuery("delete", query, values, 
    "failed to delete from wishlist due to server error.");
}

exports.getUserRes = async (req, res) => {
  const query = `
    SELECT
      r.id as reservation_id,
      r.username,
      r.order_time,
      r.estimated_pick_up,
      r.picked_up_time,
      r.approved,
      r.cancelled,
      r.pantry_id,
      p.name,
      f.id as res_food_id,
      f.name as res_food_name,
      rf.quantity as res_food_quantity
    FROM reservation r
    JOIN pantry p ON p.id = r.pantry_id
    JOIN res_food rf ON r.id = rf.reservation_id
    JOIN food f ON rf.food_id = f.id
    WHERE r.username = ?;
  `;
  let values = [[req.params.username]];

  return await execQuery("select", query, values, 
    "failed to get user reservations due to server error.");
}

exports.getUserProfileFromRes = async (pantryId, reservationId) => {
  const query = `
    SELECT
      u.first_name,
      u.email,
      p.name
    FROM reservation r
    JOIN user u ON r.username = u.username
    JOIN pantry p ON r.pantry_id = p.id
    WHERE r.pantry_id = ? AND r.id = ?;
  `;
  let values = [pantryId, reservationId];

  return await execQuery("select", query, values, 
    "failed to get user reservations due to server error.");
}