const { ObjectId } = require("mongodb");

const myTasksList = async (_, __, { db, user }) => { //get a single tasks list owned by user
    if (!user) {
        throw new Error("Authentication failed.");
    }
    // console.log(await db.collection("TasksList").findOne({ owner: ObjectId(user._id) }))
    return await db.collection("TasksList").findOne({ ownerID: ObjectId(user._id) });
}


const getTasksList = async (_, { id }, { db, user }) => { // get a single tasks list by tasks list id
    if (!user) {
        throw new Error("Authentication failed.");
    }
    const foundTasksList = await db.collection("TasksList").findOne({ _id: ObjectId(id) });
    return foundTasksList;
};

module.exports = { myTasksList, getTasksList };