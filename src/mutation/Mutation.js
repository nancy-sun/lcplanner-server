const { signUp, signIn } = require("./authMutation");
const { createTasksList, updateTasksList, deleteTasksList, addTasksListUser } = require("./tasksListMutation");
const { createTask, updateTask, deleteTask } = require("./taskMutation");

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