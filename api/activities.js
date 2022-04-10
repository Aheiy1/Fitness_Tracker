const express = require("express");
const activeRouter = express.Router();
const {requireUser} = require("./utils")

const {getAllActivities, createActivity, updateActivity, getPublicRoutinesByActivity} = require("../db");


activeRouter.use((req, res, next) => {
  console.log("Request made to /activities.");

  next();
});


activeRouter.get('/', async (req, res, next) => {
  try {
    const allActivities = await getAllActivities()
    // console.log(allActivities, "!!!!!!!")
    res.send(allActivities);
  } catch (error) {
    next(error);
  }
});

activeRouter.post('/', requireUser, async (req, res, next) => {
  const {name, description} = req.body
  try {
   const activity = await createActivity({name, description}) 
  //  console.log(activity, "FROM .POST CALL")
   res.send(activity)
  } catch (error) {
    next(error)
    }
});

activeRouter.patch('/:activityId', requireUser, async (req, res, next) => {
  const{activityId} = req.params
    const {name, description} = req.body
  try {
    const activity = await updateActivity({id: activityId, name, description});
    // console.log(activity, "FROM PATCH REQUEST")
    res.send(activity)
    
  } catch (error) {
    next(error)
    
  }
});


activeRouter.get('/:activityId/routines', async (req, res, next) => {
  const{activityId: id} = req.params
  try {
  const routine =  await getPublicRoutinesByActivity( {id})
  // console.log(routine, "FROM GET ACTIVITYID/ROUTINES REQUEST")
  res.send(routine)
} catch (error) {
  next(error);
  
}
});

module.exports = activeRouter;
