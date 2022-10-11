const { ObjectId } = require("mongodb");
const { getLCProfile } = require("../utils/utils");

const getUser = async (_, { id }, { db }) => { // get a single user
    const foundUser = await db.collection("Users").findOne({ _id: ObjectId(id) });
    return foundUser;
};

const getLCData = async (username) => {
    const data = await getLCProfile(username);
    return data;
}

module.exports = { getUser, getLCData };