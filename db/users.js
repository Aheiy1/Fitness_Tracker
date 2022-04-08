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
    // console.log("IS A USER MADE?", user);
    return user;
  } catch (error) {
    throw error;
  }
}

async function getUser({ username, password }) {
  if (!username || !password) {
    return;
  }
  try {
    const {
      rows: [user],
    } = await client.query(
      `
  SELECT * FROM users
  WHERE username = $1
  
  `,
      [username]
    );
    if (!user) {
      return null;
    }
    if (user.password === password) {
      delete user.password;
      return user;
    } else {
      return;
    }
  } catch (error) {
    throw error;
  }
}

//helper function for getAllRoutinesByUser
async function getUserByUsername(username) {
  try {
    const {
      rows: [user],
    } = await client.query(
      `
    SELECT * FROM users
    WHERE username=$1;
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

module.exports = {
  createUser,
  getUser,
  getUserById,
  getUserByUsername,
};
