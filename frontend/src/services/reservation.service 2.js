import request from "./request";

/**
 * make reservation
 *
 * @param {int} pantry_id pantry id
 * @param {Object} data that contains username, estimated_pick_up, food_ids, and quantities
 *
 * @returns Promise a response object
 */
function makeReservation(pantry_id, data) {
  return request({
    url: "/reserve/" + pantry_id,
    method: "POST",
    data: data,
    withCredentials: true,
  });
}

/**
 * fetch user's reservations
 *
 * @param {string} username username
 *
 * @returns Promise a response object
 */
function getUserReservations(username) {
  return request({
    url: "/user/" + username + "/reservations",
    method: "GET",
    withCredentials: true,
  });
}

const ReservationService = {
  makeReservation,
  getUserReservations,
};

export default ReservationService;
