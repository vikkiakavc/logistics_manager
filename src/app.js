const express = require("express");
require("./db/index");

const app = express();
const port = process.env.PORT;
const userRouter = require("./routers/userRouter");
const inventoryRouter = require("./routers/inventoryRouter");
const shipmentRouter = require("./routers/shipmentRouter");
const reportRouter = require("./routers/reportRouter");

app.use(express.json());
app.use(userRouter);
app.use(inventoryRouter);
app.use(shipmentRouter);
app.use(reportRouter);

app.get("/", (req, res) => {
  res.send("Welcome to the SUPPLY CHAIN AND LOGISTICS MANAGEMENT app");
});

app.listen(port, () => {
  console.log(`The app is up and running at ${port}`);
});
