const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');
const Customer = require('../models/Customer');
const Seller = require('../models/Seller')

//@route  POST/api/users/register
//@desc   Register a new customer
//@access public
router.post('/customer_register', async (req, res) => {
  const {firstName,lastName,address,phoneNumber,email,password} = req.body; 

  
  if (!firstName ||!lastName ||!address ||!phoneNumber ||!email ||!password) {
    return res.status(400).json({ message: "Fields are empty!" });
  }
  else{
    const customer = await Customer.findOne({email});
    const seller = await Seller.findOne({email});
    if(customer || seller){
      return res.status(400).json({message: "User already exits"});
    }else{
      
      const newCustomer = new Customer({firstName,lastName,address,phoneNumber,email,password});

      bcrypt.genSalt(10, (err, salt)=>{
        bcrypt.hash(newCustomer.password, salt, (err, hash)=>{
          if(err) throw err;
          newCustomer.password = hash;
          newCustomer.save()
          .then(customer => {
            jwt.sign(
              {id: customer._id},
              config.get('jwtSecret1'),
              { expiresIn: 3600 }, (err, token) =>{
              if(err) throw err;
              res.status(200).json({ 'token' :token, 'customer_id' : customer._id });
            })
          });
        })
      })
    }
  };
});

router.post('/seller_register', async (req, res)=>{
  const {seller_id, shopName, shopAddress, phoneNumber, email, password} = req.body;
  if (!seller_id || !shopName || !shopAddress || !phoneNumber || !email || !password){
    return res.status(400).json({message: "Fields are empty"});
  }else{
    const seller = await Seller.findOne({email});
    const customer = await Customer.findOne({email});
    if(seller || customer){
      return res.status(400).json({message: "User already exits"});
    }
    const newSeller = new Seller({seller_id, shopName, shopAddress, phoneNumber, email, password});

    bcrypt.genSalt(10, (err, salt) => {
      if(err) throw err;
      bcrypt.hash(newSeller.password, salt, (err, hash) => {
        if(err) throw err;
        newSeller.password = hash;
        newSeller.save()
        .then(seller => {
          jwt.sign(
            {id: seller._id},
            config.get('jwtSecret2'),
            { expiresIn: 3600}, (err, token)=>{
              if(err) throw err;
              res.status(200).json({ 'token' :token, 'seller_id' : seller.seller_id });
            }
          )
        })
      })
    })
  };
});

router.post('/login', async (req, res)=>{
  const {email, password} = req.body;

  if(!email || !password){
    return res.status(400).json({message: "Fields are empty"});
  }
  const customer = await Customer.findOne({email});
  const seller = await Seller.findOne({email});
  if(customer){
    bcrypt.compare(password, customer.password)
      .then(isMatch => {
        if(!isMatch){ 
          return res.status(400).json({message: "Invalid password"});
        }else{
          let token = jwt.sign({ subject: customer._id }, config.get("jwtSecret1"));
          res.status(200).json({ 'token' :token, 'customer_id' : customer._id });
        }
      })
  }else if(seller){
    bcrypt.compare(password, seller.password)
    .then(isMatch => {
      if(!isMatch){ 
        return res.status(400).json({message: "Invalid password"});
      }else{
        let token = jwt.sign({ subject: seller._id }, config.get("jwtSecret2"));
        res.status(200).json({ 'token' :token, 'seller_id' : seller.seller_id });
      }
    })
  }
  else{
    return res.status(400).json({ message: "User does not exits!" });
  }
})


router.get('/userSearches/:customer_id', async (req, res) =>{
  customerSearches = await Customer.findOne({_id: req.params.customer_id}, {searchedItems: true, _id: false});
  res.json(customerSearches);
})


router.put('/userSearches', async (req, res) =>{
  const search = req.body.search_result;
  
  Customer.findOneAndUpdate({_id: req.body.customer_id}, {$push : { searchedItems: search }}, function(err, doc) {
    if (err) {
      return res.json({'message' : 'updating array failed'});
    }
    return res.json({"updated": search});
  });

})

module.exports = router;
