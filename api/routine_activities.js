const express = require("express");
const routine_actRouter = express.Router();
const { requireUser } = require("./utils");
const {
  updateRoutineActivity,
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
     
    } catch (error) {
      next(error);
    }
  }
);

//getting my fields but for some reason they wont update after being passed with update routine activity


module.exports = routine_actRouter;
