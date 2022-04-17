const express = require("express");
const routinesRouter = express.Router();
const { requireUser } = require("./utils");
const { getAllPublicRoutines, createRoutine } = require("../db");

routinesRouter.get("/", async (req, res, next) => {
  try {
    const routines = await getAllPublicRoutines();
    res.send(routines);
  } catch (error) {
    next(error);
  }
});

routinesRouter.post("/", requireUser, async (req, res, next) => {
  const { name, goal, isPublic } = req.body;
  const creatorId = req.user.id;
  try {
    const madeRoutine = await createRoutine({
      creatorId,
      name,
      goal,
      isPublic,
    });

    // console.log(madeRoutine, "!!!!!!")
    res.send(madeRoutine);
  } catch (error) {
    next(error);
  }
});

module.exports = routinesRouter;
