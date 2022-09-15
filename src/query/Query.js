const { myTasksList, getTasksList } = require("./tasksListQuery");
const { getUser } = require("./userQuery");

const Query = {
    myTasksList,
    getTasksList,
    getUser
};

module.exports = Query;