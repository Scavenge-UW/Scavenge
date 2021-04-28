require('dotenv').config();
const db = require('../models/pantry.models.js');
const nodemailer = require('nodemailer');
const userDb = require('../models/user.models.js');

exports.getAllPantriesAction = (req, res) => {
  let result = {};
  db.getAllPantries(req, res).then(pantryDetail => {
    pantryDetail.forEach(element => {
      if (!(element['pantry_id'] in result)) {
        result[element['pantry_id']] = {};
        result[element['pantry_id']]['foods'] = {};
        result[element['pantry_id']]['reservations'] = {};
        result[element['pantry_id']]['hours'] = {};
        result[element['pantry_id']]['employees'] = {};
      }
      if ('reservation_id' in element) {
        result[element['pantry_id']]['reservations'][element['reservation_id']] = {};
        result[element['pantry_id']]['reservations'][element['reservation_id']]['res_foods'] = {};
      }
    }); 

    pantryDetail.forEach(element => {
      result[element['pantry_id']]['pantry_id']     = element['pantry_id'];
      result[element['pantry_id']]['name']          = element['name'];
      result[element['pantry_id']]['address']       = element['address'];
      result[element['pantry_id']]['zip']           = element['zip'];
      result[element['pantry_id']]['city']          = element['city'];
      result[element['pantry_id']]['state']         = element['state'];
      result[element['pantry_id']]['phone_number']  = element['phone_number'];
      result[element['pantry_id']]['email']         = element['email'];
      result[element['pantry_id']]['details']       = element['details'];
      result[element['pantry_id']]['img_src']       = element['img_src'];
      result[element['pantry_id']]['lat']           = element['lat'];
      result[element['pantry_id']]['lon']           = element['lon'];
      result[element['pantry_id']]['website']       = element['website'];
      result[element['pantry_id']]['approved']      = element['approved'];
      result[element['pantry_id']]['time_to_add']   = element['time_to_add'];
      result[element['pantry_id']]['foods'][element['food_id']] = {};
      result[element['pantry_id']]['foods'][element['food_id']]['food_id']    = element['food_id'];
      result[element['pantry_id']]['foods'][element['food_id']]['food_name']  = element['food_name'];
      result[element['pantry_id']]['foods'][element['food_id']]['qr_code']    = element['qr_code'];
      result[element['pantry_id']]['foods'][element['food_id']]['quantity']   = element['quantity'];
      if ('reservation_id' in element) {
        result[element['pantry_id']]['reservations'][element['reservation_id']]['reservation_id']     = element['reservation_id'];
        result[element['pantry_id']]['reservations'][element['reservation_id']]['username']           = element['username'];
        result[element['pantry_id']]['reservations'][element['reservation_id']]['order_time']         = element['order_time'];
        result[element['pantry_id']]['reservations'][element['reservation_id']]['estimated_pick_up']  = element['estimated_pick_up'];
        result[element['pantry_id']]['reservations'][element['reservation_id']]['picked_up_time']     = element['picked_up_time'];
        result[element['pantry_id']]['reservations'][element['reservation_id']]['approved']           = element['approved'];
        result[element['pantry_id']]['reservations'][element['reservation_id']]['cancelled']          = element['cancelled'];

        result[element['pantry_id']]['reservations'][element['reservation_id']]['res_foods'][element['res_food_id']] = {};
        result[element['pantry_id']]['reservations'][element['reservation_id']]['res_foods'][element['res_food_id']]['res_food_id'] = element['res_food_id'];
        result[element['pantry_id']]['reservations'][element['reservation_id']]['res_foods'][element['res_food_id']]['res_food_name'] = element['res_food_name'];
        result[element['pantry_id']]['reservations'][element['reservation_id']]['res_foods'][element['res_food_id']]['res_food_quantity']  = element['res_food_quantity'];
      }
      result[element['pantry_id']]['hours'][element['day']] = {};
      result[element['pantry_id']]['hours'][element['day']]['day']   = element['day'];
      result[element['pantry_id']]['hours'][element['day']]['open']    = element['open'];
      result[element['pantry_id']]['hours'][element['day']]['close']   = element['close'];
      result[element['pantry_id']]['hours'][element['day']]['detail']  = element['detail'];

      result[element['pantry_id']]['employees'][element['first_name']] = {};
      result[element['pantry_id']]['employees'][element['first_name']]['first_name']  = element['first_name'];
      result[element['pantry_id']]['employees'][element['first_name']]['last_name']   = element['last_name'];
      result[element['pantry_id']]['employees'][element['first_name']]['user_email']  = element['user_email'];

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
      pantryInfo['email'] = pantry['email'];
      pantryInfo['details'] = pantry['details'];
      pantryInfo['img_src'] = pantry['img_src'];
      pantryInfo['lat'] = pantry['lat'];
      pantryInfo['lon'] = pantry['lon'];
      pantryInfo['website'] = pantry['website'];
      pantryInfo['time_to_add'] = pantry['time_to_add'];

      //pantryInfo['reservations'] = []; we don't want to give everyone access to the reservations
      pantryInfo['foods'] = [];
      pantryInfo['hours'] = [];
      pantryInfo['employees'] = [];

      // if ('reservations' in pantry) {
      //   for (const [reservationKey, reservationData] of Object.entries(pantry['reservations'])) {
      //     let reservation = {};
      //     reservation['reservation_id'] = reservationData['reservation_id'];
      //     reservation['username'] = reservationData['username'];
      //     reservation['order_time'] = reservationData['order_time'];
      //     reservation['estimated_pick_up'] = reservationData['estimated_pick_up'];
      //     reservation['picked_up_time'] = reservationData['picked_up_time'];
      //     reservation['approved'] = reservationData['approved'];
      //     reservation['cancelled'] = reservationData['cancelled'];
  
      //     reservation['res_foods'] = [];
      //     for (const [resFoodId, foodData] of Object.entries(pantry['reservations'][reservationKey]['res_foods'])) {
      //       let food = {};
      //       food['res_food_id'] = foodData['res_food_id'];
      //       food['res_food_name'] = foodData['res_food_name'];
      //       food['res_food_quantity'] = foodData['res_food_quantity'];
      //       reservation['res_foods'].push(food);
      //     }
  
      //     pantryInfo['reservations'].push(reservation);
      //   }
      // }

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
        hour['close'] = hourData['close'];
        hour['detail'] = hourData['detail'];

        pantryInfo['hours'].push(hour);
      }

      for (const [empKey, empData] of Object.entries(pantry['employees'])) {
        let employees = {};
        employees['first_name'] = empData['first_name'];
        employees['last_name']  = empData['last_name'];
        employees['emauser_emailil']      = empData['user_email'];

        pantryInfo['employees'].push(employees);
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
    result['employees'] = {};
    pantryDetail.forEach(element => {
      if ('reservation_id' in element) {
        result['reservations'][element['reservation_id']] = {};
        result['reservations'][element['reservation_id']]['res_foods'] = {};
      }
    }); 

    pantryDetail.forEach(element => {
      result['pantry_id']     = element['pantry_id'];
      result['name']          = element['name'];
      result['address']       = element['address'];
      result['zip']           = element['zip'];
      result['city']          = element['city'];
      result['state']         = element['state'];
      result['phone_number']  = element['phone_number'];
      result['email']         = element['email'];
      result['details']       = element['details'];
      result['img_src']       = element['img_src'];
      result['lat']           = element['lat'];
      result['lon']           = element['lon'];
      result['website']       = element['website'];
      result['approved']      = element['approved'];
      result['time_to_add']   = element['time_to_add'];
      result['foods'][element['food_id']] = {};
      result['foods'][element['food_id']]['food_id']    = element['food_id'];
      result['foods'][element['food_id']]['food_name']  = element['food_name'];
      result['foods'][element['food_id']]['qr_code']    = element['qr_code'];
      result['foods'][element['food_id']]['quantity']   = element['quantity'];
      if ('reservation_id' in element) {
        result['reservations'][element['reservation_id']]['reservation_id']     = element['reservation_id'];
        result['reservations'][element['reservation_id']]['username']           = element['username'];
        result['reservations'][element['reservation_id']]['order_time']         = element['order_time'];
        result['reservations'][element['reservation_id']]['estimated_pick_up']  = element['estimated_pick_up'];
        result['reservations'][element['reservation_id']]['picked_up_time']     = element['picked_up_time'];
        result['reservations'][element['reservation_id']]['approved']           = element['approved'];
        result['reservations'][element['reservation_id']]['cancelled']          = element['cancelled'];

        result['reservations'][element['reservation_id']]['res_foods'][element['res_food_id']] = {};
        result['reservations'][element['reservation_id']]['res_foods'][element['res_food_id']]['res_food_id']        = element['res_food_id'];
        result['reservations'][element['reservation_id']]['res_foods'][element['res_food_id']]['res_food_name']      = element['res_food_name'];
        result['reservations'][element['reservation_id']]['res_foods'][element['res_food_id']]['res_food_quantity']  = element['res_food_quantity'];
      }
      result['hours'][element['day']] = {};
      result['hours'][element['day']]['day']     = element['day'];
      result['hours'][element['day']]['open']    = element['open'];
      result['hours'][element['day']]['close']   = element['close'];
      result['hours'][element['day']]['detail']  = element['detail'];

      result['employees'][element['first_name']] = {};
      result['employees'][element['first_name']]['first_name']  = element['first_name'];
      result['employees'][element['first_name']]['last_name']  = element['last_name'];
      result['employees'][element['first_name']]['user_email']  = element['user_email'];

    });

    // Format the data
    const pantry = result;
    let pantryInfo = {};
    pantryInfo['pantry_id'] = pantry['pantry_id'];
    pantryInfo['name'] = pantry['name'];
    pantryInfo['address'] = pantry['address'];
    pantryInfo['email'] = pantry['email'];
    pantryInfo['zip'] = pantry['zip'];
    pantryInfo['city'] = pantry['city'];
    pantryInfo['state'] = pantry['state'];
    pantryInfo['phone_number'] = pantry['phone_number'];
    pantryInfo['details'] = pantry['details'];
    pantryInfo['img_src'] = pantry['img_src'];
    pantryInfo['lat'] = pantry['lat'];
    pantryInfo['lon'] = pantry['lon'];
    pantryInfo['website'] = pantry['website'];
    pantryInfo['time_to_add'] = pantry['time_to_add'];

    pantryInfo['reservations'] = [];
    pantryInfo['foods'] = [];
    pantryInfo['hours'] = [];
    pantryInfo['employees'] = [];

    // Only include the reservations if the user is signed in and part of the pantry
    if (req.user && req.isEmployeeOf.includes(pantryInfo['pantry_id']) && 'reservations' in pantry) {
      for (const [reservationKey, reservationData] of Object.entries(pantry['reservations'])) {
        let reservation = {};
        reservation['reservation_id'] = reservationData['reservation_id'];
        reservation['username'] = reservationData['username'];
        reservation['order_time'] = reservationData['order_time'];
        reservation['estimated_pick_up'] = reservationData['estimated_pick_up'];
        reservation['picked_up_time']    = reservationData['picked_up_time'];
        reservation['approved'] = reservationData['approved'];
        reservation['cancelled'] = reservationData['cancelled'];
  
        reservation['res_foods'] = [];
        for (const [resFoodId, foodData] of Object.entries(pantry['reservations'][reservationKey]['res_foods'])) {
          let food = {};
          food['res_food_id'] = foodData['res_food_id'];
          food['res_food_name'] = foodData['res_food_name'];
          food['res_food_quantity'] = foodData['res_food_quantity'];
          reservation['res_foods'].push(food);
        }
  
        pantryInfo['reservations'].push(reservation);
      }  
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
      hour['close'] = hourData['close'];
      hour['detail'] = hourData['detail'];

      pantryInfo['hours'].push(hour);
    }

    for (const [empKey, empData] of Object.entries(pantry['employees'])) {
      let employees = {};
      employees['first_name'] = empData['first_name'];
      employees['last_name']  = empData['last_name'];
      employees['user_email']      = empData['user_email'];

      pantryInfo['employees'].push(employees);
    }     

    return res.status(200).json(pantryInfo);
  }).catch(error => {
    console.log(error);
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

exports.updateEstimatedPickUpAction = (req, res) => {
  db.updateEstimatedPickUp(req, res).then(data => {
    return res.status(200).json(data);
  }).catch(error => {
    return res.status(500).json({ message: "Error in query. Failed to update pantry hours." });
  });
}

exports.updateReservationAction = (req, res) => {
  db.updateReservation(req, res).then(async data => {
    if (req.params.action == "cancel") {
      // Add foods back into DB that they reserved
      try {
        var resFood = await(db.getResFood(req, res));
        resFood.forEach(async(element, index) => {
          db.cancelReservation(req, res, element.food_id, element.quantity);
        });
      } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error in query. Failed to cancel reservation." });
      }
    } else if (req.params.action == "approve") {
      // Send approval email to user
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'scavenge.uw@gmail.com',
          pass: 'Scavenge951!'
        }
      });

      let resInfo = await userDb.getUserProfileFromRes(req.params.pantry_id, req.params.reservation_id);
      resInfo = JSON.parse(JSON.stringify(resInfo));
      const userEmail = resInfo[0]['email'];
      const userFirstName = resInfo[0]['first_name'];
      const pantryName = resInfo[0]['name'];
      
      const mailOptions = {
        from: 'scavenge.uw@gmail.com',
        to: userEmail,
        subject: 'Scavenge - Reservation Approved',
        html: `<p>Hi, ${userFirstName},</p><p>Your reservation at <strong>${pantryName}</strong> has been approved! Please view it at <a>https://scavenge-uw.herokuapp.com/</a>.</p><p>Thanks, </p><p>Scavenge UW Team</p>`
      };
      
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
    }
    return res.status(200).json(data);
  }).catch(error => {
    console.log(error);
    return res.status(500).json({ message: "Error in query. Failed to update reservation." });
  });
}

exports.foodSearchAction = (req, res) => {
  let result = {};
  db.foodSearch(req, res).then(pantryDetail => {
    pantryDetail.forEach(element => {
      if (!(element['pantry_id'] in result)) {
        result[element['pantry_id']] = {};
        result[element['pantry_id']]['foods'] = {};
        result[element['pantry_id']]['hours'] = {};
      }
    }); 

    pantryDetail.forEach(element => {
      result[element['pantry_id']]['pantry_id']     = element['pantry_id'];
      result[element['pantry_id']]['name']          = element['name'];
      result[element['pantry_id']]['address']       = element['address'];
      result[element['pantry_id']]['zip']           = element['zip'];
      result[element['pantry_id']]['city']          = element['city'];
      result[element['pantry_id']]['state']         = element['state'];
      result[element['pantry_id']]['phone_number']  = element['phone_number'];
      result[element['pantry_id']]['email']         = element['email'];
      result[element['pantry_id']]['img_src']       = element['img_src'];
      result[element['pantry_id']]['website']       = element['website'];
      result[element['pantry_id']]['approved']      = element['approved'];
      result[element['pantry_id']]['foods'][element['food_id']] = {};
      result[element['pantry_id']]['foods'][element['food_id']]['food_id']    = element['food_id'];
      result[element['pantry_id']]['foods'][element['food_id']]['food_name']  = element['food_name'];
      result[element['pantry_id']]['foods'][element['food_id']]['qr_code']    = element['qr_code'];
      result[element['pantry_id']]['foods'][element['food_id']]['quantity']   = element['quantity'];
    
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
      pantryInfo['email'] = pantry['email'];
      pantryInfo['img_src'] = pantry['img_src'];
      pantryInfo['website'] = pantry['website'];

      pantryInfo['foods'] = [];
      pantryInfo['hours'] = [];

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
        hour['close'] = hourData['close'];
        hour['detail'] = hourData['detail'];

        pantryInfo['hours'].push(hour);
      }
      resultsArr.push(pantryInfo);
    }
    result = resultsArr;

    return res.status(200).json(result);
  }).catch(error => {
    console.log(error);
    return res.status(500).json({
      message: "Search failed. Error in query."
    });
  });
}

exports.pantryAddEmployeeAction = (req, res) => {
  // Check whether user is emp of this pantry
  let pantryIdInt = parseInt(req.params.pantry_id, 10);
  if (req.isEmployeeOf.indexOf(pantryIdInt) == -1) {
    return res.status(200).json({ message: "Error. Employee login required" });
  }
  db.pantryAddEmployee(req, res).then(data => {
    return res.status(200).json(data);
  }).catch(error => {
  let sqlMessage;
    if (error.err['code'] === 'ER_NO_REFERENCED_ROW_2') {
      sqlMessage = "User does not exist."
    } else if (error.err['code'] === 'ER_DUP_ENTRY') {
      sqlMessage = "Duplicate entry. User is already employee.";
    }
    return res.status(500).json({ message: "Error in query. Failed to add employee.",
    detail: sqlMessage });
  });
}

exports.pantryRemoveEmployeeAction = (req, res) => {
  let pantryIdInt = parseInt(req.params.pantry_id, 10);
  if (req.isEmployeeOf.indexOf(pantryIdInt) == -1) {
    return res.status(200).json({ message: "Error. Employee login required" });
  }
  db.pantryRemoveEmployee(req, res).then(data => {
    return res.status(200).json(data);
  }).catch(error => {
    return res.status(500).json({ message: "Error in query. Failed to remove employee." });
  });
}