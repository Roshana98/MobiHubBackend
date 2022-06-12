const express = require('express');
const app = express();
const router = express.Router();

// Mobile model
let SellerPhones = require('../models/seller_phones')

// Add mobile
router.route('/create').post((req, res, next) => {
  SellerPhones.create(req.body, (error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
});


router.route('/read/:id').get((req, res) => {
  SellerPhones.findById(req.params.id, (error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
})

// Update mobile
router.route('/update/:id').put((req, res, next) => {
  SellerPhones.findByIdAndUpdate(req.params.id, {
    $set: req.body
  }, (error, data) => {
    if (error) {
      return next(error);
      console.log(error)
    } else {
      res.json(data)
      console.log('Data updated successfully')
    }
  })
})

// Delete mobile
router.route('/delete/:id').delete((req, res, next) => {
  SellerPhones.findOneAndRemove(req.params.id, (error, data) => {
    if (error) {
      return next(error);
    } else {
      res.status(200).json({
        msg: data
      })
    }
  })
})

//seller Phones
router.route('/:seller_id').get((req, res, next) => {
  SellerPhones.find({seller_id:req.params.seller_id},(error, data)=> { 
    if (error) return next(error);
    res.json(data);
  })
  });

module.exports = router;