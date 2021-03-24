const db = require('../models/pantry.models.js');

exports.getAllPantriesAction = (req, res) => {
  //db.getAllPantries(req, res).then()
}

exports.getPantryDetailAction = (req, res) => {
  db.getPantryDetail(req, res).then(pantryDetail => {
    //Associative list
    let result = {};
    result['foods'] = {};
    result['reservations'] = {};
    result['hours'] = {};
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
      result['hours'][element['day']] = {};
      result['hours'][element['day']]['day']   = element['day'];
      result['hours'][element['day']]['open']    = element['open'];
      result['hours'][element['day']]['close']   = element['close'];
      result['hours'][element['day']]['detail']  = element['detail'];
    })
    return res.status(200).json(result);
  }).catch(error => {
    return res.status(500).json({ message: "Failed to get pantry info due to server error." });
  });
}

exports.pantryUpdateInventoryAction = (req, res) => {
  db.pantryUpdateInventory(req, res).then(data => {
    return res.status(200).json(data);
  }).catch(error => {
    return res.status(500).json({ message: "Error in query. Failed to update pantry inventory." });
  });
}

exports.pantryUpdateDetailAction = (req, res) => {
  db.pantryUpdateDetail(req, res).then(data => {
    return res.status(200).json(data);
  }).catch(error => {
    return res.status(500).json({ message: "Error in query. Failed to update pantry detail." });
  });
}

exports.getPantryHoursAction = (req, res) => {
  db.getPantryHours(req, res).then(hours => {
    return res.status(200).json(hours);
  }).catch(error => {
    console.log(error);
    return res.status(500).json({
      message: "Failed to get pantry hours due to server error."
    });
  });
}

exports.pantryUpdateHoursAction = (req, res) => {
  db.pantryUpdateHours(req, res).then(data => {
    return res.status(200).json(data);
  }).catch(error => {
    return res.status(500).json({ message: "Error in query. Failed to update pantry hours." });
  });
}

exports.updateReservationAction = (req, res) => {
  db.updateReservation(req, res).then(data => {
    return res.status(200).json(data);
  }).catch(error => {
    return res.status(500).json({ message: "Error in query. Failed to update reservation." });
  });
}

exports.foodSearchAction = (req, res) => {
  db.foodSearch(req, res).then(pantries => {
    return res.status(200).json(pantries);
  }).catch(error => {
    console.log(error);
    return res.status(500).json({
      message: "Search failed. Error in query."
    });
  });
}