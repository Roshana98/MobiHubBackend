const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const PreviousPrices = new Schema({
    Date: {type: String},
    Price:{type: Number}
},{_id: false});

const phonePricesSchema = new Schema({
    phone_name: {
        type: String
    },
    prices: [PreviousPrices],
    
    predicted_price: {
        type: Number
    }
});

module.exports = mongoose.model("price_details", phonePricesSchema);