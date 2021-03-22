const db = require('../models/pantry.models.js');

exports.getPantryDetailAction = (req, res) => {
  db.getPantryDetail(req, res).then(pantryDetail => {
    //Associative list
    let result = {};
    result['foods'] = {};
    result['reservations'] = {};
    pantryDetail.forEach(element => {
      result['pantry_id']     = element['pantry_id'];
      result['name']          = element['name'];
      result['address']       = element['address'];
      result['zip']           = element['zip'];
      result['city']          = element['city'];
      result['state']         = element['state'];
      result['phone_number']  = element['phone_number'];
      result['details']       = element['details'];
      result['img_src']       = element['img_src'];
      result['lat']           = element['lat'];
      result['lon']           = element['lon'];
      result['website']       = element['website'];
      result['foods'][element['food_id']] = {};
      result['foods'][element['food_id']]['food_id']    = element['food_id'];
      result['foods'][element['food_id']]['food_name']  = element['food_name'];
      result['foods'][element['food_id']]['qr_code']    = element['qr_code'];
      result['foods'][element['food_id']]['quantity']   = element['quantity'];
      if ('reservation_id' in element){
        result['reservations'][element['reservation_id']] = {};
        result['reservations'][element['reservation_id']]['reservation_id']     = element['reservation_id'];
        result['reservations'][element['reservation_id']]['username']           = element['username'];
        result['reservations'][element['reservation_id']]['order_time']         = element['order_time'];
        result['reservations'][element['reservation_id']]['estimated_pick_up']  = element['estimated_pick_up'];
        result['reservations'][element['reservation_id']]['picked_up_time']     = element['picked_up_time'];
        result['reservations'][element['reservation_id']]['approved']           = element['approved'];
        result['reservations'][element['reservation_id']]['cancelled']          = element['cancelled'];
      }
      
    })
    return res.json(result);
  }).catch(error => {
    console.log(error);
  });
}

exports.pantryUpdateInventoryAction = (req, res) => {
  db.pantryUpdateInventory(req, res).then(data => {
    return res.json(data);
  }).catch(error => {
    console.log(error);
  });
}