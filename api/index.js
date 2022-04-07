// create an api router
// attach other routers from files in this api directory (users, activities...)
// export the api router


const express = require("express");
const apiRouter = express.Router();

apiRouter.get("/health", async (req, res, next) => {
   try {
       res.send({message:"all is well."})
   } catch (error) {
       next (error);
   }
});

const usersRouter = require("./users");
apiRouter.use("/users", usersRouter);







module.exports = apiRouter;