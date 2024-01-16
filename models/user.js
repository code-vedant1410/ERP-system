const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: { values: ["admin", "user", "viewer"], message: "invalid role" },
  },
  dob: { type: Date },
  contact: {
    email: { type: String, unique: true, sparse: true },
    mobile: { type: String, unique: true, sparse: true },
  },
  gender: {
    type: String,
    enum: { values: ["male", "female"], message: "invalid Gender" },
  },
});
userSchema.pre("save", async function (next) {
  const user = this;
  if (!user.isModified("password")) return next();
  const saltRounds = 10;
  const hash = await bcrypt.hash(user.password, saltRounds);
  user.password = hash;
  next();
});
userSchema.methods.checkPassword = async function (password) {
  return bcrypt.compare(password, this.password);
};
const User = mongoose.model("User", userSchema);
module.exports = User;
