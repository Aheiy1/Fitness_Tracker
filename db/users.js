const res = require("express/lib/response");
const client = require("./client");

async function createUser({ username, password }) {
  try {
    const {
      rows: [user],
    } = await client.query(
      `
   INSERT INTO users(username,password)
   VALUES($1,$2)
   ON CONFLICT (username) DO NOTHING
   RETURNING id, username
    `,
      [username, password]
    );
    return user;
  } catch (error) {
    throw error;
  }
}

async function getUser({ username, password }) {
  try {
    const { rows: user } = await client.query(
      `
  SELECT * FROM users
  WHERE username = $1
  
  `,
      [username]
    );
    return user;
  } catch (error) {
    throw error;
  }
}

async function getUserById(id) {
  try {
    const {
      rows: [user],
    } = await client.query(
      `
    SELECT * FROM users
    WHERE id = $1
    `,
      [id]
    );
    return user;
  } catch (error) {
    throw error;
  }
}

module.exports = { client, createUser, getUser, getUserById };
