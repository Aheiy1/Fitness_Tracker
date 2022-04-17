const client = require("./client");

async function getRoutineActivityById( id ) {
  try {
    const { rows: [routine_activity] } = await client.query(
      `
    SELECT * FROM routine_activities
    WHERE "routineId" = $1;`,
      [id]
    );
    return routine_activity;
  } catch (error) {
    throw error;
  }
}

async function addActivityToRoutine({
  routineId,
  activityId,
  count,
  duration,
}) {
  try {
    const {
      rows: [routine_activity],
    } = await client.query(
      `
  INSERT INTO routine_activities ("routineId", "activityId", count, duration)
  VALUES ($1, $2, $3, $4)
  ON CONFLICT ("routineId", "activityId") DO NOTHING
  RETURNING *;
  `,
      [routineId, activityId, count, duration]
    );
    console.log(routine_activity, "This is my log on line 20!!!!")
    return routine_activity;
  } catch (error) {
    throw error;
  }
}

async function getRoutineActivitiesByRoutine({ id }) {
  try {
    const { rows: routine_activity } = await client.query(
      `
    SELECT * FROM routine_activities
    WHERE "routineId" = $1;`,
      [id]
    );
    return routine_activity;
  } catch (error) {
    throw error;
  }
}

async function updateRoutineActivity({ id, ...fields }) {
 console.log(fields, "at the top")
  const setString = Object.keys(fields)
    .map((key, index) => 
      `"${key}"=$${index + 1}`
    )
    .join(", ");
  if (setString.length === 0) {
    return;
  }
  try {
    const {
      rows: [routine_activity],
    } = await client.query(
      `
    UPDATE routine_activities
    SET ${setString}
    WHERE id=${id}
    RETURNING *;
    `,
      Object.values(fields)
    );
    // console.log(routine_activity, "from line 78")
    return routine_activity;
  } catch (error) {
    throw error;
  }
}

async function destroyRoutineActivity(id) {
  try {
    const {
      rows: [routine_activity],
    } = await client.query(
      `
  DELETE FROM routine_activities
  WHERE id = $1
  RETURNING *;
  
  `,
      [id]
    );
    return routine_activity;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  addActivityToRoutine,
  getRoutineActivitiesByRoutine,
  updateRoutineActivity,
  destroyRoutineActivity,
  getRoutineActivityById
};
