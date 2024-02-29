const express = require("express");
const session = require('express-session');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const bodyParser = require("body-parser");
const api = require("./api/apiAll");
const connection = require("./services/databaseServices");
const app = express();

global.con = connection;
require("dotenv").config();

app.use(cors());
app.use("/api", api);
app.use(bodyParser.json());
app.use(express.json());
app.use(cookieParser());
app.use(session({
  secret: 'session_secret_key', // Change this to a random secret key
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Change to true if using HTTPS
}));


const PORT = 5760;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
