const { signUp, signIn } = require("./authMutation");
const { createTasksList, updateTasksList, deleteTasksList, addTasksListUser } = require("./tasksListMutation");
const { createTask, updateTask, deleteTask } = require("./taskMutation");
const { updateAvatar } = require("./userMutation");

const Mutation = {
    /* auth */
    signUp,
    signIn,

    updateAvatar,

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