// const bcrypt = require("bcrypt");

// const userCollection = "users";

// const registerUser = async (req, res) => {
//   try {
//     const { username, password } = req.body;
//     const existingUser = await con.collection("users").findOne({ username });
//     if (existingUser) {
//       return res.status(400).json({ message: "Username already exists" });
//     }
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const result = await con
//       .collection(userCollection)
//       .insertOne({ username, password: hashedPassword });
//     console.log("ddd", result);

//     if (result.insertedId) {
//       res.json({ message: "User registered successfully" });
//     } else {
//       res.status(500).json({ message: "Error registering user" });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };

// module.exports = { registerUser };
const { config } = require("dotenv");
const { errorHandler } = require("../middlewares/errorMiddleware");
const User = require("../models/user");
const userREPO = require("../repositories/userRepository");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const configkey = require("../config/config");

const userController = {
  registerUser: async (req, res) => {
    try {
      const { username, password, role, gender,email,mobile } = req.body;
      const newUser = new User({
        username,
        password,
        role,
        mobile,
        email,
        gender,
      });
      const savedUser = await newUser.save();
      console.log(savedUser);
      const token = jwt.sign(
        { userId: savedUser.id, username: savedUser.username },
        configkey.secretKey,
        { expiresIn: "1h" }
      );
        userREPO.successResponse(
          res,
          { savedUser, token },
          "User registered successfully"
        );
    } catch (error) {
      if (error.code === 11000) {
        userREPO.errorResponse(
          res,
          400,
          "Username or email or number already exists"
        );
      } else {
        console.error(error);
        userREPO.errorResponse(res, 500, "Internal Server Error", error);
      }
    }
  },

  loginUser: async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await User.findOne({ username });
      console.log(user);

      // let isvlaidpassword = await bcrypt.compare(password, user.password);
      // console.log("70", isvlaidpassword);
      if (!user || !(await user.checkPassword(password))) {
        userREPO.errorResponse(res, 401, "Invalid credentials");
      } else {
        const token = jwt.sign(
          { userId: user.id, username: user.username },
          configkey.secretKey,
          { expiresIn: "1h" }
        );

        userREPO.successResponse(
          res,
          { user, token },
          "User logged in successfully"
        );
      }
    } catch (error) {
      console.error(error);
      userREPO.errorResponse(res, 500, "Internal Server Error", error);
    }
  },
};

module.exports = userController;
