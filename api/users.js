const express = require("express");
const usersRouter = express.Router();
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;
const { getUserByUsername, createUser, getUser } = require("../db");

usersRouter.post("/register", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const _user = await getUserByUsername(username);
    if (_user) {
      res.status(401);
      next({
        name: "UserExistsError",
        message: "A user by that username already exists",
      });
    } else if (password.length < 8) {
      res.status(401);
      next({ name: "PasswordLenghtError", message: "Passwrod Too Short!" });
    } else {
      const user = await createUser({ username, password });
      if (!user) {
        next({
          name: "UserCreationError",
          message: "There was a probelm registering you. Please try again.",
        });
      } else {
        // json token
        const token = jwt.sign(
          { id: user.id, username: username },
          process.env.JWT_SECRET
        );
        res.send({ user ,token, message: "you're logged in!" });
      }
    }
  } catch (error) {
    next(error);
  }
});

// usersRouter.post("/register", async (req, res, next) => {
//   const { username, password } = req.body;

//   try {
//     if (password.length < 8) {
//       res.status(401);
//      next ({
//         name: "password error",
//         message: "Password is too short",
//       });
//     }
//     const _user = await getUserByUsername(username);
//     if (_user) {
//       res.status(401);
//      next({
//         name: "UserExistsError",
//         message: "A user by that username already exists",
//       });
//     } else {
//       const user = await createUser({
//         username,
//         password,
//       });
//       res.send({ user });
//     }
//   } catch (error) {
//     next(error);
//   }
// });

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
