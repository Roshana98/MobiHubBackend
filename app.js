const express = require("express");
const mongoose = require("mongoose");
const config = require("config");
const cors = require('cors');
const PORT = process.env.port || 3000;

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/phones", require("./routes/phoneRoutes"));
app.use("/api/seller", require("./routes/sellerRoutes"));


mongoose.connect(config.get("mongoUri"), (err, db) => {
  if (err) {
    console.log(`Unable to connect to databse. Error:,${err}`);
  } else {
    console.log("Connected to Server successfully!");
  }
});


app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});
