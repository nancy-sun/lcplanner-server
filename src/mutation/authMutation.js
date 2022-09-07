const bcrypt = require("bcryptjs");
const { getToken } = require("../utils/utils");

const signUp = async (_, { input }, { db }) => {
    const hashPw = bcrypt.hashSync(input.password); //hash password
    const newUser = { ...input, password: hashPw }; //update password with hashed
    const result = await db.collection("Users").insertOne(newUser);
    const userID = result.insertedId;
    const foundUser = await db.collection("Users").findOne({ _id: userID });
    return { user: foundUser, token: getToken(foundUser) };
};

const signIn = async (_, { input }, { db }) => {
    const foundUser = await db.collection("Users").findOne({ email: input.email });
    if (!foundUser) { //verify email
        throw new Error("Invalid credentials");
    }
    const verifyPw = bcrypt.compareSync(input.password, foundUser.password);
    if (!verifyPw) { //verify password
        throw new Error("Invalid credentials");
    }
    return { user: foundUser, token: getToken(foundUser) };
};

module.exports = { signUp, signIn };