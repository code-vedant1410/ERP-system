const express = require("express");
const bodyParser = require("body-parser");
const api = require("./api/apiAll");
const connection = require("./services/databaseServices");
const cors = require('cors');
const app = express();
global.con = connection;
require("dotenv").config();

app.use(cors());
app.use("/api", api);
app.use(bodyParser.json());

const PORT = 5760;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
