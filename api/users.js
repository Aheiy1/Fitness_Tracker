const express = require("express");
const usersRouter = express.Router();
const { getUserByUsername, createUser } = require("../db");

usersRouter.post("/register", async (req, res, next) => {
  const { username, password } = req.body;

  try {
    if (password.length < 8) {
      next({ message: "password-to-short" });
    }
    return;
    // check to see if username is taken

    const _user = await getUserByUsername(username);

    if (_user) {
      next({
        name: "UserExistsError",
        message: "A user by that username already exists",
      });
    }

    // create user in database
    const user = await createUser({
      username,
      password,
    });

    // create token

    res.send({
      message: "Thank you for signing up!",
      token,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = usersRouter;
