const db = require('../models/pantry.models.js');

exports.getPantryDetailAction = (req, res) => {
  db.getPantryDetail(req, res).then(pantryDetail => {
    return res.json(pantryDetail);
  }).catch(error => {
    console.log(error);
  });
}