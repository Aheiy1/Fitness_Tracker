// require and re-export all files in this db directory (users, activities...
module.exports = {
  ...require("./users"),
  ...require("./activity"),
  ...require("./routines"),
  ...require("./routine_activities"),
};
