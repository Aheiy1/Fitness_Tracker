const client = require("./client");

async function createActivity({ name, description }) {
  try {
    const {
      rows: [activity],
    } = await client.query(
      `
        INSERT INTO activities(name, description)
        VALUES ($1, $2)
        RETURNING *;
        `,
      [name, description]
    );

    return activity;
  } catch (error) {
    throw error;
  }
}
async function updateActivity({ id, ...fields }) {
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
      rows: [activity],
    } = await client.query(
      `
      UPDATE activities
      SET ${setString}
      WHERE id=${id}
      RETURNING *;
      `,
      Object.values(fields)
    );
    return activity;
  } catch (error) {
    throw error;
  }
}
async function createRoutine() {}

async function getRoutinesWithoutActivities() {}

async function getAllActivities() {
  try {
    const { rows: activities } = await client.query(`
    SELECT * FROM activities`);
    return activities;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  client,
  createActivity,
  updateActivity,
  createRoutine,
  getRoutinesWithoutActivities,
  getAllActivities,
};
