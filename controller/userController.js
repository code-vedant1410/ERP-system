const bcrypt = require("bcrypt");

const userCollection = "users";

const registerUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const existingUser = await con.collection("users").findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await con
      .collection(userCollection)
      .insertOne({ username, password: hashedPassword });
    console.log("ddd", result);
    
    if (result.insertedId) {
      res.json({ message: "User registered successfully" });
    } else {
      res.status(500).json({ message: "Error registering user" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { registerUser };
