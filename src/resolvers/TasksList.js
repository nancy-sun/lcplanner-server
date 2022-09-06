const TasksList = {
    id: ({ _id, id }) => _id || id, // id as _id in mongoDB
    progress: async ({ _id }, _, { db }) => {
        const tasks = await db.collection("Tasks").find({ tasksListID: _id }).toArray();
        const completed = tasks.filter(task => task.isCompleted);
        if (tasks.length === 0) {
            return 0;
        }
        const progression = (completed.length / tasks.length) * 100;
        return progression;
    },
    access: async ({ accessIDs }, _, { db }) => Promise.all(  // connect with Users collection
        accessIDs.map((accessID) => db.collection("Users").findOne({ _id: accessID }))
    ),
    tasks: async ({ _id }, _, { db }) => await db.collection("Tasks").find({ tasksListID: _id }).toArray() // get all tasks in task list
};

module.exports = TasksList;