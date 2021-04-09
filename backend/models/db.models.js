const { execQuery } = require('../query');

// only intended for use with TEST DB
exports.deleteFoodData = async (req, res) => {
  const query = `
    DELETE FROM food;
  `;
  return await execQuery("delete", query);
}
exports.deleteHoursData = async (req, res) => {
  const query = `
    DELETE FROM hours;
  `;
  return await execQuery("delete", query);
}
exports.deleteInventoryData = async (req, res) => {
  const query = `
    DELETE FROM inventory;
  `;
  return await execQuery("delete", query);
}
exports.deleteMessageData = async (req, res) => {
  const query = `
    DELETE FROM message;
  `;
  return await execQuery("delete", query);
}
exports.deletePantryData = async (req, res) => {
  const query = `
    DELETE FROM pantry
    WHERE id <> 1;
  `;
  return await execQuery("delete", query);
}
exports.deleteResFoodData = async (req, res) => {
  const query = `
    DELETE FROM res_food;
  `;
  return await execQuery("delete", query);
}
exports.deleteReservationData = async (req, res) => {
  const query = `
    DELETE FROM reservation;
  `;
  return await execQuery("delete", query);
}
exports.deleteUserData = async (req, res) => {
  const query = `
    DELETE FROM user
    WHERE username <> 'sean1';
  `;
  return await execQuery("delete", query);
}
exports.deleteUserToPantryData = async (req, res) => {
  const query = `
    DELETE FROM user_to_pantry
    WHERE username <> 'sean1';
  `;
  return await execQuery("delete", query);
}
exports.deleteWishlistData = async (req, res) => {
  const query = `
    DELETE FROM wishlist;
  `;
  return await execQuery("delete", query);
}
