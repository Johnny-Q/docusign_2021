const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

const User = new Schema({
  name: String,
  email: String,
  password: String,
  audits: [{ type: Schema.Types.ObjectId, ref: "Audit" }]
});

User.methods.generateHash = function (password) {
  return bcrypt.hashSync(password, 8);
};

User.methods.validPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model("User", User);
