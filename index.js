// create the express server here
require("dotenv").config();
const {PORT = 3000} = process.env
const express = require('express')
const server = express();
const morgan = require('morgan')
const cors = require('cors')
const client = require('./db/client');


require('dotenv').config();
client.connect();
server.use(morgan("dev"));
server.use(express.json());
server.use(cors());

const apiRouter = require("./api");
server.use("/api", apiRouter);


server.listen(PORT, () => {
    console.log("the server is running", PORT);
  });