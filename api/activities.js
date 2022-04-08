const express = require("express");
const activeRouter = express.Router();
const {requireUser} = require("./utils")

const {getAllActivities, createActivity, updateActivity} = require("../db")

activeRouter.use((req, res, next) => {
  console.log("Request made to /activities.");

  next();
});


activeRouter.get('/', async (req, res, next) => {
  try {
    const allActivities = await getAllActivities()
    res.send(allActivities);
  } catch (error) {
    next(error);
  }
});

activeRouter.post('/', requireUser, async (req, res, next) => {
  const {name, description} = req.body
  try {
   const activity = await createActivity({name, description}) 
   res.send(activity)
  } catch (error) {
    next(error)
    }
});

activeRouter.patch('/:activityId', requireUser, async (req, res, next) => {

  try {
    
  } catch (error) {
    next(error)
    
  }
});

module.exports = activeRouter;
