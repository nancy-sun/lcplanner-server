const { ObjectId } = require("mongodb");

const Query = {
    myTasksList: async (_, __, { db, user }) => { //get all tasks list under a user
        if (!user) {
            throw new Error("Authentication failed.");
        }
        return await db.collection("TasksList").find({ accessIDs: user._id }).toArray();

    },

    getTasksList: async (_, { id }, { db, user }) => { // get a single tasks list
        if (!user) {
            throw new Error("Authentication failed.");
        }
        const foundTasksList = await db.collection("TasksList").findOne({ _id: ObjectId(id) });
        return foundTasksList;
    },
};

module.exports = Query;