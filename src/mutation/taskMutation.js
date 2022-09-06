const { ObjectId } = require("mongodb");

const createTask = async (_, { title, deadline, note, tasksListID, date }, { db, user }) => {
    if (!user) {
        throw new Error("Authentication failed.");
    }
    const newTask = {
        title,
        deadline,
        note,
        date,
        tasksListID: ObjectId(tasksListID),
        isCompleted: false
    };
    const result = await db.collection("Tasks").insertOne(newTask);
    const taskID = result.insertedId;
    const foundTask = await db.collection("Tasks").findOne({ _id: taskID });
    return foundTask;
};

const updateTask = async (_, data, { db, user }) => {
    if (!user) {
        throw new Error("Authentication failed.");
    }
    await db.collection("Tasks").updateOne({ _id: ObjectId(data.id) }, { $set: data });
    const foundTask = await db.collection("Tasks").findOne({ _id: ObjectId(data.id) });
    return foundTask;
};

const deleteTask = async (_, { id }, { db, user }) => {
    if (!user) {
        throw new Error("Authentication failed.");
    }
    await db.collection("Tasks").deleteOne({ _id: ObjectId(id) });
    return true;
};

module.exports = { createTask, updateTask, deleteTask };