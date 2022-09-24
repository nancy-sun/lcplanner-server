const { myTasksList, getTasksList, getAccessTasksList } = require("./tasksListQuery");
const { getUser } = require("./userQuery");

const Query = {
    myTasksList,
    getTasksList,
    getAccessTasksList,
    getUser
};

module.exports = Query;