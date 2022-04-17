const express = require("express");
const routine_actRouter = express.Router();
const { requireUser } = require("./utils");
const {
  updateRoutineActivity,
  getRoutineActivitiesByRoutine,
  getRoutineById,
  getRoutineActivityById,
} = require("../db");

routine_actRouter.patch(
  "/:routineActivityId",
  requireUser,
  async (req, res, next) => {
    const { routineActivityId } = req.params;
    const { count, duration } = req.body;
    const fields = {id : routineActivityId };
    

    if (count) {
      fields.count = count;
    }
    if (duration) {
      fields.duration = duration;
    }
    try {
        const routineAct = await getRoutineActivityById(routineActivityId);
        console.log(routineAct, "routineAct");
        const routineQuery = await getRoutineById(routineAct.routineId);
        console.log(routineQuery, "routine!");
        if(req.user.id === routineQuery.creatorId){
           const update = await updateRoutineActivity( fields);
           res.send(update);
        } else (
            res.status(401)
        )
        console.log(fields, "beforeupdate")
      console.log(fields, "AFTERRRRR")
     
    } catch (error) {
      next(error);
    }
  }
);




module.exports = routine_actRouter;
