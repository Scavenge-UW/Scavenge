const db = require('../models/pantry.models.js');

exports.getAllPantriesAction = (req, res) => {
  let result = {};
  db.getAllPantries(req, res).then(pantryDetail => {
    pantryDetail.forEach(element => {
      if (!(element['pantry_id'] in result)) {
        // Don't want to reset these fields for each row corresponding to the same pantry id
        result[element['pantry_id']] = {};
        result[element['pantry_id']]['foods'] = {};
        result[element['pantry_id']]['reservations'] = {};
        result[element['pantry_id']]['hours'] = {};
      } 

      result[element['pantry_id']]['pantry_id']     = element['pantry_id'];
      result[element['pantry_id']]['name']          = element['name'];
      result[element['pantry_id']]['address']       = element['address'];
      result[element['pantry_id']]['zip']           = element['zip'];
      result[element['pantry_id']]['city']          = element['city'];
      result[element['pantry_id']]['state']         = element['state'];
      result[element['pantry_id']]['phone_number']  = element['phone_number'];
      result[element['pantry_id']]['details']       = element['details'];
      result[element['pantry_id']]['img_src']       = element['img_src'];
      result[element['pantry_id']]['lat']           = element['lat'];
      result[element['pantry_id']]['lon']           = element['lon'];
      result[element['pantry_id']]['website']       = element['website'];
      result[element['pantry_id']]['foods'][element['food_id']] = {};
      result[element['pantry_id']]['foods'][element['food_id']]['food_id']    = element['food_id'];
      result[element['pantry_id']]['foods'][element['food_id']]['food_name']  = element['food_name'];
      result[element['pantry_id']]['foods'][element['food_id']]['qr_code']    = element['qr_code'];
      result[element['pantry_id']]['foods'][element['food_id']]['quantity']   = element['quantity'];
      if ('reservation_id' in element) {
        result[element['pantry_id']]['reservations'][element['reservation_id']] = {};
        result[element['pantry_id']]['reservations'][element['reservation_id']]['reservation_id']     = element['reservation_id'];
        result[element['pantry_id']]['reservations'][element['reservation_id']]['username']           = element['username'];
        result[element['pantry_id']]['reservations'][element['reservation_id']]['order_time']         = element['order_time'];
        result[element['pantry_id']]['reservations'][element['reservation_id']]['estimated_pick_up']  = element['estimated_pick_up'];
        result[element['pantry_id']]['reservations'][element['reservation_id']]['picked_up_time']     = element['picked_up_time'];
        result[element['pantry_id']]['reservations'][element['reservation_id']]['approved']           = element['approved'];
        result[element['pantry_id']]['reservations'][element['reservation_id']]['cancelled']          = element['cancelled'];
      }
      result[element['pantry_id']]['hours'][element['day']] = {};
      result[element['pantry_id']]['hours'][element['day']]['day']   = element['day'];
      result[element['pantry_id']]['hours'][element['day']]['open']    = element['open'];
      result[element['pantry_id']]['hours'][element['day']]['close']   = element['close'];
      result[element['pantry_id']]['hours'][element['day']]['detail']  = element['detail'];
    });

    // Convert into array format without using ids as keys
    let resultsArr = [];
    for (let pantryId in result) {
      const pantry = result[pantryId];
      let pantryInfo = {};
      pantryInfo['pantry_id'] = pantry['pantry_id'];
      pantryInfo['name'] = pantry['name'];
      pantryInfo['address'] = pantry['address'];
      pantryInfo['zip'] = pantry['zip'];
      pantryInfo['city'] = pantry['city'];
      pantryInfo['state'] = pantry['state'];
      pantryInfo['phone_number'] = pantry['phone_number'];
      pantryInfo['details'] = pantry['details'];
      pantryInfo['img_src'] = pantry['img_src'];
      pantryInfo['lat'] = pantry['lat'];
      pantryInfo['lon'] = pantry['lon'];
      pantryInfo['website'] = pantry['website'];

      pantryInfo['reservations'] = [];
      pantryInfo['foods'] = [];
      pantryInfo['hours'] = [];

      for (const [reservationKey, reservationData] of Object.entries(pantry['reservations'])) {
        let reservation = {};
        reservation['reservation_id'] = reservationData['reservation_id'];
        reservation['username'] = reservationData['username'];
        reservation['order_time'] = reservationData['order_time'];
        reservation['estimated_pick_up'] = reservationData['estimated_pick_up'];
        reservation['approved'] = reservationData['approved'];
        reservation['cancelled'] = reservationData['cancelled'];

        pantryInfo['reservations'].push(reservation);
      }

      for (const [foodKey, foodData] of Object.entries(pantry['foods'])) {
        let food = {};
        food['food_id'] = foodData['food_id'];
        food['food_name'] = foodData['food_name'];
        food['qr_code'] = foodData['qr_code'];
        food['quantity'] = foodData['quantity'];

        pantryInfo['foods'].push(food);
      }
      
      for (const [hourKey, hourData] of Object.entries(pantry['hours'])) {
        let hour = {};
        hour['day'] = hourData['day'];
        hour['open'] = hourData['open'];
        hour['close'] = hourData['closed'];
        hour['detail'] = hourData['detail'];

        pantryInfo['hours'].push(hour);
      }
      resultsArr.push(pantryInfo);
    }
    result = resultsArr;

    return res.status(200).json({result});
  }).catch(error => {
    console.log(error);
    return res.status(500).json({ message: "Failed to get all pantries due to server error." });
  });
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
      if ('reservation_id' in element) {
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
    });

    // Format the data
    const pantry = result;
    let pantryInfo = {};
    pantryInfo['pantry_id'] = pantry['pantry_id'];
    pantryInfo['name'] = pantry['name'];
    pantryInfo['address'] = pantry['address'];
    pantryInfo['zip'] = pantry['zip'];
    pantryInfo['city'] = pantry['city'];
    pantryInfo['state'] = pantry['state'];
    pantryInfo['phone_number'] = pantry['phone_number'];
    pantryInfo['details'] = pantry['details'];
    pantryInfo['img_src'] = pantry['img_src'];
    pantryInfo['lat'] = pantry['lat'];
    pantryInfo['lon'] = pantry['lon'];
    pantryInfo['website'] = pantry['website'];

    pantryInfo['reservations'] = [];
    pantryInfo['foods'] = [];
    pantryInfo['hours'] = [];

    for (const [reservationKey, reservationData] of Object.entries(pantry['reservations'])) {
      let reservation = {};
      reservation['reservation_id'] = reservationData['reservation_id'];
      reservation['username'] = reservationData['username'];
      reservation['order_time'] = reservationData['order_time'];
      reservation['estimated_pick_up'] = reservationData['estimated_pick_up'];
      reservation['approved'] = reservationData['approved'];
      reservation['cancelled'] = reservationData['cancelled'];

      pantryInfo['reservations'].push(reservation);
    }

    for (const [foodKey, foodData] of Object.entries(pantry['foods'])) {
      let food = {};
      food['food_id'] = foodData['food_id'];
      food['food_name'] = foodData['food_name'];
      food['qr_code'] = foodData['qr_code'];
      food['quantity'] = foodData['quantity'];

      pantryInfo['foods'].push(food);
    }
    
    for (const [hourKey, hourData] of Object.entries(pantry['hours'])) {
      let hour = {};
      hour['day'] = hourData['day'];
      hour['open'] = hourData['open'];
      hour['close'] = hourData['closed'];
      hour['detail'] = hourData['detail'];

      pantryInfo['hours'].push(hour);
    }

    return res.status(200).json(pantryInfo);
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