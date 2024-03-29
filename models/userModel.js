const mongoose = require("mongoose");
const bcrypt = ""; //require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: { values: ["admin", "user", "viewer"], message: "invalid role" },
      default: "user",
    },
    email: { type: String, unique: true, sparse: true },
    mobile: { type: String, unique: true, sparse: true },
    gender: {
      type: String,
      enum: { values: ["male", "female"], message: "invalid Gender" },
    },
  },
  { versionKey: false, timestamps: true }
);

userSchema.pre("save", async function (next) {
  const user = this;
  if (!user.isModified("password")) return next();
  // const saltRounds = 10;
  // const hash = await bcrypt.hashSync(user.password, saltRounds);
  // user.password = hash;
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
