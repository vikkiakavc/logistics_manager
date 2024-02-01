const express = require("express");
require("./db/index");
const app = express();

const port = process.env.PORT;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to the SUPPLY CHAIN AND LOGISTICS MANAGEMENT app");
});

app.listen(port, () => {
  console.log(`The app is up and running at ${port}`);
});
