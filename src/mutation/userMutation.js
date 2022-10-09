const { ObjectId } = require("mongodb");

const updateAvatar = async (_, data, { db, user }) => {
    if (!user) {
        throw new Error("Authentication failed.");
    };
    await db.collection("Users").updateOne({ _id: ObjectId(data.id) }, { $set: { avatar: data.avatar } });
    return true;
};

module.exports = { updateAvatar };