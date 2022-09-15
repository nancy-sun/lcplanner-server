const { ObjectId } = require("mongodb");

const getUser = async (_, { id }, { db }) => { // get a single user
    const foundUser = await db.collection("Users").findOne({ _id: ObjectId(id) });
    return foundUser;
};

module.exports = { getUser };