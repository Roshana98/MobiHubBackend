const mongoose = require('mongoose');
const Schema = mongoose.Schema;


let sellerPhonesSchema = new Schema({
   seller_id: {
      type:String
   },
   brand: {
      type: String
   },
   model: {
      type: String
   },
   price: {
      type: String
   },
   date: {
      type: String
   }
})

module.exports = mongoose.model('seller_phones', sellerPhonesSchema)