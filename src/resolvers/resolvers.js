const Query = require("../query/Query");
const Mutation = require("../mutation/Mutation");
const User = require("./User");
const TasksList = require("./TasksList");
const Task = require("./Task");

const resolvers = {
    Query, Mutation, User, TasksList, Task
};

module.exports = resolvers;