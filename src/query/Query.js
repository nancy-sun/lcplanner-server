
const myTasksList = require("./tasksListQuery").myTasksList;
const getTasksList = require("./tasksListQuery").getTasksList;

const Query = {
    myTasksList,
    getTasksList
};

module.exports = Query;