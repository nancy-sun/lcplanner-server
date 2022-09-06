const Task = {
    id: ({ _id, id }) => _id || id, // id as _id in mongoDB
    tasksList: async ({ tasksListID }, _, { db }) => // connect task to tasksList
        await db.collection("TasksList").findOne({ _id: tasksListID })
};

module.exports = Task;