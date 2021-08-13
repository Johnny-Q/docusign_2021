require("dotenv").config();
const express = require("express");
const fileUpload = require("express-fileupload");
const cors = require("cors");
// const path = require("path");
const mongoose = require("mongoose");

const app = express();
app.use(
  fileUpload({
    createParentPath: true
  })
);
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

app.use(express.static("uploads"));
// app.use(express.static("build"));
require("./routes")(app);

app.listen(process.env.PORT ?? 5000, () => {
  console.log("Server is running...");
});
