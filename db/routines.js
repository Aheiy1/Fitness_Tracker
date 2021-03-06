const client = require("./client");
const { attachActivitiesToRoutines } = require("./activity");
const { getUserByUsername } = require("./users");

async function getAllRoutines() {
  try {
    const { rows: routines } = await client.query(`
    SELECT routines.*, users.username AS "creatorName"
     FROM routines
     JOIN users ON routines."creatorId" = users.id
    `);
    // console.log(routines, "from get all routines");
    // console.log(await attachActivitiesToRoutines(routines));
    return await attachActivitiesToRoutines(routines);
  } catch (error) {
    throw error;
  }
}

async function getAllRoutinesByUser({ username }) {
  try {
    const user = await getUserByUsername(username);
    const { rows: routines } = await client.query(
      `
  SELECT routines.*, users.username AS "creatorName"
  FROM routines
  JOIN users ON routines."creatorId" = users.id
  WHERE "creatorId" = $1;
  `,
      [user.id]
    );

    return await attachActivitiesToRoutines(routines);
  } catch (error) {
    throw error;
  }
}

async function getPublicRoutinesByUser({ username }) {
  try {
    const user = await getUserByUsername(username);
    const { rows: routines } = await client.query(
      `
     SELECT routines.*, users.username AS "creatorName"
     FROM routines
     JOIN users ON routines."creatorId" = users.id
     WHERE "creatorId" = $1 and "isPublic" = true;
     `,
      [user.id]
    );

    return await attachActivitiesToRoutines(routines);
  } catch (error) {
    throw error;
  }
}
async function getPublicRoutinesByActivity({ id }) {
  try {
    const { rows: routines } = await client.query(
      `
    SELECT routines.*, users.username AS "creatorName" 
    FROM routines
     JOIN users ON routines."creatorId" = users.id
     JOIN routine_activities ON routine_activities."routineId" = routines.id
     WHERE routines."isPublic" = true AND routine_activities."activityId"=$1;
     
     `,
      [id]
    );
    return await attachActivitiesToRoutines(routines);
  } catch (error) {
    throw error;
  }
}
async function getRoutinesWithoutActivities() {
  try {
    const { rows: routines } = await client.query(`
    SELECT * FROM routines`);
    return routines;
  } catch (error) {
    throw error;
  }
}
async function createRoutine({ creatorId, isPublic, name, goal }) {
  try {
    const {
      rows: [routine],
    } = await client.query(
      `
   INSERT INTO routines("creatorId", "isPublic", name, goal)
   VALUES($1,$2,$3,$4)
   RETURNING *;
   `,
      [creatorId, isPublic, name, goal]
    );
   
    return routine;
  } catch (error) {
    throw error;
  }
}

async function updateRoutine({ id, ...fields }) {
  const setString = Object.keys(fields)
    .map((key, index) => {
      return `"${key}"=$${index + 1}`;
    })
    .join(", ");
  if (setString.length === 0) {
    return;
  }
  try {
    const {
      rows: [routine],
    } = await client.query(
      `
      UPDATE routines
      SET ${setString}
      WHERE id=${id}
      RETURNING *;
      `,
      Object.values(fields)
    );
    return routine;
  } catch (error) {
    throw error;
  }
}

async function getRoutineById(id) {
  try {
    const {
      rows: [routine],
    } = await client.query(`
    SELECT *
    FROM routines
    WHERE id = ${id}
    `);
    return routine;
  } catch (error) {
    throw error;
  }
}


async function getAllPublicRoutines() {
  try {
    const { rows: routines } = await client.query(`
    SELECT routines.*, users.username AS "creatorName"
     FROM routines
     JOIN users ON routines."creatorId" = users.id
     WHERE "isPublic" = true
    `);
    // console.log(routines, "from get all routines");
    // console.log(attachActivitiesToRoutines(routines));
    return await attachActivitiesToRoutines(routines);
  } catch (error) {
    throw error;
  }
}
async function destroyRoutine(id) {
  try {
    await client.query(
      `
DELETE FROM routine_activities
WHERE "routineId" = $1;`,
      [id]
    );
    const {
      rows: [routine],
    } = await client.query(
      `
          DELETE 
          FROM routines
          WHERE id = $1
          RETURNING*;`,
      [id]
    );

    return routine;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getAllRoutines,
  createRoutine,
  getRoutineById,
  getAllPublicRoutines,
  getRoutinesWithoutActivities,
  getAllRoutinesByUser,
  getPublicRoutinesByUser,
  getPublicRoutinesByActivity,
  updateRoutine,
  destroyRoutine,
};
