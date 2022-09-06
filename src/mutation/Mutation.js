const signUp = require("./authMutation").signUp;
const signIn = require("./authMutation").signIn;
const createTasksList = require("./tasksListMutation").createTasksList;
const updateTasksList = require("./tasksListMutation").updateTasksList;
const deleteTasksList = require("./tasksListMutation").deleteTasksList;
const addTasksListUser = require("./tasksListMutation").addTasksListUser;
const createTask = require("./taskMutation").createTask;
const updateTask = require("./taskMutation").updateTask;
const deleteTask = require("./taskMutation").deleteTask;

const Mutation = {
    /* auth */
    signUp,
    signIn,

    /* tasks list */
    createTasksList,
    updateTasksList,
    deleteTasksList,
    addTasksListUser,

    /* task */
    createTask,
    updateTask,
    deleteTask,
};

module.exports = Mutation;