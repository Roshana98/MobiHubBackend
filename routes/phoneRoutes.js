const express = require('express');
const router = express.Router();
const spawn = require("child_process").spawn;
const Price_details = require('../models/prices')
const Phone_details = require('../models/phone_details');


//@route  GET/api/phones
//@desc  
//@access public
router.get('/', async (req, res) => {
  lower_range = [];
  semi_medium_range = []; 
  medium_range = []; 
  semi_high_range = []; 
  high_range = [];


  const allPhones = await Phone_details.find();
  if (!allPhones) {
    res.status(400).json({ message: "phones not found" });
  } 
  else{

    for (phone_detail of allPhones) {
      phone_detail.phone_price = phone_detail.phone_price * 193
      if (phone_detail.phone_price < 25000) {
        lower_range.push(phone_detail); 
        lower_range.sort((a, b) => (a.average_rating > b.average_rating) ? -1 : 1)
        lower_range = lower_range.slice(0, 20)
      }
      else if (phone_detail.phone_price > 25000 && phone_detail.phone_price < 50000) {
        semi_medium_range.push(phone_detail)

        semi_medium_range.sort((a, b) => (a.average_rating > b.average_rating) ? -1 : 1)
        semi_medium_range = semi_medium_range.slice(0, 20)
      }
      else if (phone_detail.phone_price > 50000 && phone_detail.phone_price < 75000) {
        medium_range.push(phone_detail)
        medium_range.sort((a, b) => (a.average_rating > b.average_rating) ? -1 : 1)
        medium_range = medium_range.slice(0, 20)
      }

      else if (phone_detail.phone_price > 75000 && phone_detail.phone_price < 100000) {
        semi_high_range.push(phone_detail)
        semi_high_range.sort((a, b) => (a.average_rating > b.average_rating) ? -1 : 1)
        semi_high_range = semi_high_range.slice(0, 20)
      }
      else if (phone_detail.phone_price > 100000) {
        high_range.push(phone_detail)
        high_range.sort((a, b) => (a.average_rating > b.average_rating) ? -1 : 1)
        high_range = high_range.slice(0, 20)
      }
    }
    res.json({
      'lower_range': lower_range,
      'semi_medium_range': semi_medium_range,
      'medium_range': medium_range,
      'semi_high_range': semi_high_range,
      "high_range": high_range
    })
  }
});


//@route  GET/api/phones/top_rated
//@desc   
//@access public
router.get('/top_rated', async (req, res) => {
  top_phones = []
  const allPhones = await Phone_details.find().sort({ average_rating: -1 })
   //if the phones are not found a error message is sent
  if (!allPhones) {
    res.status(400).json({ 'message': 'Phones not found' });
  }
  else{
    for (phone of allPhones) {
      phone.phone_price = phone.phone_price * 193
      top_phones.push(phone)
    }
    
    top_phones = top_phones.slice(0, 10)
    res.status(200).json(top_phones);
  }
})


//@route  GET/api/phones/top_rated
//@desc   
//@access public
router.get('/phone_names', async (req, res) => {
  const phone_names = []
  const phoneNames = await Phone_details.find({}, { phone_name: true, _id: false }); 
  if (!phoneNames) {
    res.status(400).json({ message: "phones not found" });
  }
  
  else {
    for (phone of phoneNames) {
      phone_names.push(phone.phone_name);
    }
    res.status(200).json(phone_names);
  }
})


//@route  GET/api/phones/top_rated
//@desc  
//@access public
router.get('/predicted_phones', async (req, res) => {
  all_phones_names = []
  prediction_phone_names = []
  selected_phones = []
  
  const phoneDetails = await Phone_details.find({}, { phone_name: true, _id: false });
  if (!phoneDetails) {
    res.status(400).json({ 'message': 'phones not found' });
  }
  
  else {
    for (phone of phoneDetails) {
      all_phones_names.push(phone.phone_name);
    }

  
    const price_details = await Price_details.find({}, { phone_name: true, _id: false });
    if (!price_details) {
      res.status(400).json({ 'message': 'phones not found' });
    }
     
    else {
      for (predicted_phone of price_details) {
        prediction_phone_names.push(predicted_phone.phone_name);
      }
     
      for (predictedPhoneName of prediction_phone_names) {
        if (all_phones_names.includes(predictedPhoneName)) {
          selectedPhone = await Phone_details.findOne({ phone_name: predictedPhoneName });
          selected_phones.push(selectedPhone)
        }
      }
    }
  }
  res.status(200).json({ "predicted_phones": selected_phones });
})


//@route  GET/api/phones/phone_features/:phone_name
//@desc   
//@access public
router.get('/phone_features/:phone_name', async (req, res) => {
  
  const phone_name = req.params.phone_name;
  const selected_phone_featues = await Phone_details.findOne({ phone_name });

  if (!selected_phone_featues) {
    res.status(400).json({ 'message': 'phone not found' });
  }
  res.status(200).json(selected_phone_featues);
})


//@route  GET/api/phones/predicted_phones/:phone_name
//@desc  
//@access public
router.get('/predicted_phones/:phone_name', async (req, res) => {
  
  const phone_name = req.params.phone_name;
  const selected_phone_prices = await Price_details.findOne({ phone_name });


  if (!selected_phone_prices) {
    res.status(400).json({ 'message': 'prediction not available' });
  } else {
    res.status(200).json(selected_phone_prices);
  }
})


//@route  GET/api/phones/recommendated_phones/:customer_id
//@desc   
//@access public
router.get('/recommendated_phones/:customer_id', async (req, res) => {
  recommendedPhonesArray = [];
  var process = spawn('python', ['ContentBased.py', req.params.customer_id]);
  console.log("spawned: " + process.pid);

  process.stdout.on('data', async function (data) {
    console.log("python script ends  now..!!!");
    var out = data.toString();
    var punctuationless = out.replace(/['|'[|]|\r|\n|]/g, "");
    var ar = punctuationless.split(', ');

    for (item of ar){
      const phone_name = item;
      const phone = await Phone_details.findOne({ phone_name });
      phone.phone_price = phone.phone_price * 193
      recommendedPhonesArray.push(phone);
    }
    recommendedPhonesArray.sort((a, b) => (a.average_rating > b.average_rating) ? -1 : 1)
    recommendedPhonesArray = recommendedPhonesArray.slice(0, 8);
    res.setHeader('Content-Type', 'application/json');
    return res.send({ recommendedPhonesArray });
  });

  process.stderr.on('data', (err) => {
    console.log("Error: " + err);
  });
});


module.exports = router;  