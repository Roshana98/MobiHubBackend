const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const phoneDetailsSchema = new Schema({
  brand: { type: String },
  phone_name: { type: String },
  phone_price: {type: Number},
  phone_image: { type: String },
  available_status: {type: String},
  average_rating: { type: Number },
  battery_rating: { type: Number },
  design_rating: { type: Number },
  camera_rating: { type: Number },
  connectivity_rating: { type: Number },
  performance_rating: { type: Number },
  user_rating: { type: Number },
  cpu: {type: String},
  density: {type: String},
  diagonal: {type: String},
  processor_model: {type: String},
  resolution: {type: String},
  screen_type: {type: String},
  size: {type: String},
  usuable_surface: {type: String},
  weight: {type: String},
  aspect_ratio: {type: String}
});

module.exports = mongoose.model("phone_details", phoneDetailsSchema);
