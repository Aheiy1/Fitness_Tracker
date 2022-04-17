const express = require("express");
const routinesRouter = express.Router();
const { requireUser } = require("./utils");
const {
  getAllPublicRoutines,
  createRoutine,
  updateRoutine,
  destroyRoutine,
  getRoutineById,
  addActivityToRoutine,
} = require("../db");

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

routinesRouter.patch("/:routineId", requireUser, async (req, res, next) => {
  const { isPublic, name, goal } = req.body;
  const { routineId } = req.params;

  try {
    const newRoutine = await updateRoutine({
      id: routineId,
      isPublic,
      name,
      goal,
    });
    res.send(newRoutine);
  } catch (error) {
    next(error);
  }
});

routinesRouter.delete("/:routineId", requireUser, async (req, res, next) => {
  const id = req.params.routineId;
  try {
    await getRoutineById(id);
    const deletedRoutine = await destroyRoutine(id);

    res.send(deletedRoutine);
  } catch (error) {
    next(error);
  }
});

routinesRouter.post(
  "/:routineId/activities",
  requireUser,
  async (req, res, next) => {
    const { activityId, count, duration } = req.body;
    const { routineId } = req.params;
    try {
      const addActivity = await addActivityToRoutine({
        routineId,
        activityId,
        count,
        duration,
      });
      if (!addActivity) {
        next();
      } else {
        res.send(addActivity);
      }
    } catch (error) {
      next(error);
    }
  }
);

module.exports = routinesRouter;
