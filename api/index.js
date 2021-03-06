// create an api router
// attach other routers from files in this api directory (users, activities...)
// export the api router

const express = require("express");
const apiRouter = express.Router();
const { JWT_SECRET = "neverTell" } = process.env;
const jwt = require("jsonwebtoken");
const { getUserById } = require("../db");

apiRouter.get("/health", async (req, res, next) => {
  try {
    res.send({ message: "all is well." });
  } catch (error) {
    next(error);
  }
});

apiRouter.use(async (req, res, next) => {
  const prefix = "Bearer ";
  const auth = req.header("Authorization");

  if (!auth) {
    // nothing to see here
    next();
  } else if (auth.startsWith(prefix)) {
    const token = auth.slice(prefix.length);

    try {
      const { id } = jwt.verify(token, JWT_SECRET);

      if (id) {
        req.user = await getUserById(id);
        next();
      }
    } catch ({ name, message }) {
      next({ name, message });
    }
  } else {
    next({
      name: "AuthorizationHeaderError",
      message: `Authorization token must start with ${prefix}`,
    });
  }
});
apiRouter.use((req, res, next) => {
  if (req.user) {
    console.log("User is set:", req.user);
  }

  next();
});

const usersRouter = require("./users");
apiRouter.use("/users", usersRouter);

const activeRouter = require("./activities");
apiRouter.use("/activities", activeRouter);

const routinesRouter = require("./routines");
apiRouter.use("/routines", routinesRouter);

const routine_actRouter = require("./routine_activities");
apiRouter.use("/routine_activities", routine_actRouter);

apiRouter.use((error, req, res, next) => {
  res.send({
    name: error.name,
    message: error.message,
  });
});

module.exports = apiRouter;
