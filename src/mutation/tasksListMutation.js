const { ObjectId } = require("mongodb");

const createTasksList = async (_, { recap }, { db, user }) => {
    if (!user) {
        throw new Error("Authentication failed.");
    }
    const newTasksList = {
        recap,
        ownerID: user._id,
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
    }
    await db.collection("TasksList").updateOne({ _id: ObjectId(id) }, { $set: { recap: recap } });
    const foundTasksList = await db.collection("TasksList").findOne({ _id: ObjectId(id) });
    return foundTasksList;
};

const deleteTasksList = async (_, { id }, { db, user }) => {
    if (!user) {
        throw new Error("Authentication failed.");
    }
    await db.collection("TasksList").deleteOne({ _id: ObjectId(id) });
    return true;
};

// add friend
const addTasksListUser = async (_, { tasksListID, userEmail }, { db, user }) => {
    if (!user) {
        throw new Error("Authentication failed.");
    }
    const userFound = await db.collection("Users").findOne({ email: userEmail })
    if (!userFound) {
        throw new Error(`No user with ${userEmail} exists.`);
    }
    const tasksList = await db.collection("TasksList").findOne({ _id: ObjectId(tasksListID) });
    if (!tasksList) {
        throw new Error("no tasks list exits");
    }
    // check if user already exists in access list
    if (tasksList.accessIDs.find((id) => id.toString() === userFound._id.toString())) {
        return tasksList;
    };
    await db.collection("TasksList").updateOne({ _id: ObjectId(tasksListID) }, { $push: { accessIDs: userFound._id } });
    const updatedTasksList = await db.collection("TasksList").findOne({ _id: tasksListID });
    return updatedTasksList;
};

module.exports = { createTasksList, updateTasksList, deleteTasksList, addTasksListUser };