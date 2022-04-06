const client = require("./client");
const { attachActivitiesToRoutines } = require("./activity");

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
    const { rows: routines } = await client.query(
      `
   INSERT INTO routines("creatorId", "isPublic", name, goal)
   VALUES($1,$2,$3,$4)
   RETURNING *;
   `,
      [creatorId, isPublic, name, goal]
    );
    console.log(routines, "FROM CREATE ROUTINE");
    return routines;
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
    return attachActivitiesToRoutines(routines);
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
};
