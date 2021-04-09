const { execQuery } = require('../query');

// only intended for use with TEST DB
exports.deleteFoodData = async (req, res) => {
  const query = `
    DELETE FROM food
    WHERE id <> 46;
  `;
  return await execQuery("delete", query);
}
exports.deleteHoursData = async (req, res) => {
  const query = `
    DELETE FROM hours
    WHERE id <> 27 AND id <> 28 AND id <> 29 AND id <> 30 AND id <> 31 AND id <> 32 AND id <> 33;
  `;
  return await execQuery("delete", query);
}
exports.deleteInventoryData = async (req, res) => {
  const query = `
    DELETE FROM inventory
    WHERE id <> 65;
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
    DELETE FROM res_food
    WHERE id <> 55;
  `;
  return await execQuery("delete", query);
}
exports.deleteReservationData = async (req, res) => {
  const query = `
    DELETE FROM reservation
    WHERE id <> 123;
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
    DELETE FROM wishlist
    WHERE id <> 8;
  `;
  return await execQuery("delete", query);
}
