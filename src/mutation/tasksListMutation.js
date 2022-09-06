const { ObjectId } = require("mongodb");

const createTasksList = async (_, { recap }, { db, user }) => {
    if (!user) {
        throw new Error("Authentication failed.");
    };
    const newTasksList = {
        recap,
        accessIDs: [user._id]
    };
    const result = await db.collection("TasksList").insertOne(newTasksList);
    const tasksListID = result.insertedId;
    const foundTasksList = await db.collection("TasksList").findOne({ _id: tasksListID });
    return foundTasksList;
};

const updateTasksList = async (_, { id, recap }, { db, user }) => {
    if (!user) {
        throw new Error("Authentication failed.");
    };
    await db.collection("TasksList").updateOne({ _id: ObjectId(id) }, { $set: { recap: recap } });
    const foundTasksList = await db.collection("TasksList").findOne({ _id: ObjectId(id) });
    return foundTasksList;
};

const deleteTasksList = async (_, { id }, { db, user }) => {
    if (!user) {
        throw new Error("Authentication failed.");
    };
    await db.collection("TasksList").deleteOne({ _id: ObjectId(id) });
    return true;
};

const addTasksListUser = async (_, { tasksListID, userID }, { db, user }) => {
    if (!user) {
        throw new Error("Authentication failed.");
    };
    const tasksList = await db.collection("TasksList").findOne({ _id: ObjectId(tasksListID) });
    if (!tasksList) return null;
    // check if user already exists in access list
    if (tasksList.accessIDs.find((id) => id.toString() === userID.toString())) {
        return tasksList;
    };
    await db.collection("TasksList").updateOne({ _id: ObjectId(tasksListID) }, { $push: { accessIDs: ObjectId(userID) } });
    const updatedTasksList = await db.collection("TasksList").findOne({ _id: ObjectId(tasksListID) });
    return updatedTasksList;
};

module.exports = { createTasksList, updateTasksList, deleteTasksList, addTasksListUser }