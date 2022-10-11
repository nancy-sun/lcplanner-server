const { myTasksList, getTasksList, getAccessTasksList } = require("./tasksListQuery");
const { getUser, getLCData } = require("./userQuery");

const Query = {
    myTasksList,
    getTasksList,
    getAccessTasksList,
    getUser,
    getLCData
};

module.exports = Query;