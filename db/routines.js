const client = require("./client");
const { attachActivitiesToRoutines } = require("./activity");

async function getAllRoutines() {
  try {
    const { rows: routines } = await client.query(`
    SELECT routines.*, users.username AS "creatorName"
     FROM routines
     JOIN users ON routines."creatorId" = users.id
    `);
    console.log(routines, "from get all routines");
    console.log(attachActivitiesToRoutines(routines));
    return attachActivitiesToRoutines(routines);
  } catch (error) {
    throw error;
  }
}

module.exports = { getAllRoutines };
