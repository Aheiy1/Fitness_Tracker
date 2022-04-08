// create the express server here
require("dotenv").config();
const {PORT = 3000} = process.env
const express = require('express')
const server = express();
const morgan = require('morgan')
const cors = require('cors')
const client = require('./db/client');

console.log(process.env.JWT_SECRET);

client.connect();
server.use(morgan("dev"));
server.use(express.json());
server.use(cors());

const apiRouter = require("./api");
server.use("/api", apiRouter);

// server.get("*", (req, res, next) => {
//   res.status(404).send("not found");
// });
// server.use(({name, message}, req, res, next) => {
//   res.status(500).send({name, message});
// });
server.listen(PORT, () => {
    console.log("the server is running", PORT);
  });