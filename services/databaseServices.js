const mongoose = require("mongoose");

const connection = mongoose
  .connect(
    "mongodb+srv://vedantb658:191020@cluster0.hzehkah.mongodb.net/newDB",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("Connected to db");
  })
  .catch((err) => {
    console.log("Error while connecting to database", err);
  });
