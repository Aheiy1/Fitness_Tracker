const express = require("express");
const usersRouter = express.Router();
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;
const { getUserByUsername, createUser, getUser } = require("../db");

usersRouter.post("/register", async (req, res, next) => {
  const { username, password } = req.body;

  try {
    if (password.length < 8) {
      return res.status(400).json({
        name: "password error",
        message: "Password is too short",
      });
    }
    const _user = await getUserByUsername(username);
    if (_user) {
      return res.status(400).json({
        name: "UserExistsError",
        message: "A user by that username already exists",
      });
    } else {
      const user = await createUser({
        username,
        password,
      });
      res.send({ user });
    }
  } catch (error) {
    next(error);
  }
});

usersRouter.post("/login", async (req, res, next) => {
  // console.log(req, "request");
  const { username, password } = req.body;

  // request must have both
  if (!username || !password) {
    next({
      name: "MissingCredentialsError",
      message: "Please supply both a username and password",
    });
  }

  try {
    const user = await getUser(req.body);

    if (user) {
      // create token & return to user
      const token = jwt.sign(
        { id: user.id, username: username },
        process.env.JWT_SECRET
      );
      res.send({ token, message: "you're logged in!" });
    } else {
      next({
        name: "IncorrectCredentialsError",
        message: "Username or password is incorrect",
      });
    }
  } catch (error) {
    // console.log(error);
    next(error);
  }
});

module.exports = usersRouter;
