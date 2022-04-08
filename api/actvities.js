const express = require("express");
const activeRouter = express.Router();

activeRouter.use((req, res, next) => {
  console.log("Request made to /posts.");

  next();
});

module.exports = activeRouter;
