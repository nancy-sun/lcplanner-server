const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { ObjectId } = require("mongodb");

const getToken = (user) => jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30 days' });

const Mutation = {
    /* auth */
    signUp: async (_, { input }, { db }) => {
        const hashPw = bcrypt.hashSync(input.password); //hash password
        const newUser = { ...input, password: hashPw }; //update password with hashed
        const result = await db.collection("Users").insertOne(newUser);
        const userID = result.insertedId;
        const foundUser = await db.collection("Users").findOne({ _id: userID });
        return { user: foundUser, token: getToken(foundUser) };
    },

    signIn: async (_, { input }, { db }) => {
        const foundUser = await db.collection("Users").findOne({ email: input.email });
        if (!foundUser) { //verify email
            throw new Error("Invalid credentials");
        }
        const verifyPw = bcrypt.compareSync(input.password, foundUser.password);
        if (!verifyPw) { //verify password
            throw new Error("Invalid credentials");
        }
        return { user: foundUser, token: getToken(foundUser) };
    },

    /* tasks list */
    createTasksList: async (_, { recap }, { db, user }) => {
        if (!user) {
            throw new Error("Authentication failed.");
        }
        const newTasksList = {
            recap,
            accessIDs: [user._id]
        };
        const result = await db.collection("TasksList").insertOne(newTasksList);
        const tasksListID = result.insertedId;
        const foundTasksList = await db.collection("TasksList").findOne({ _id: tasksListID });
        return foundTasksList;
    },

    updateTasksList: async (_, { id, recap }, { db, user }) => {
        if (!user) {
            throw new Error("Authentication failed.");
        }
        await db.collection("TasksList").updateOne({ _id: ObjectId(id) }, { $set: { recap: recap } });
        const foundTasksList = await db.collection("TasksList").findOne({ _id: ObjectId(id) });
        return foundTasksList;
    },

    deleteTasksList: async (_, { id }, { db, user }) => {
        if (!user) {
            throw new Error("Authentication failed.");
        }
        await db.collection("TasksList").deleteOne({ _id: ObjectId(id) });
        return true;
    },

    addTasksListUser: async (_, { tasksListID, userID }, { db, user }) => {
        if (!user) {
            throw new Error("Authentication failed.");
        }

        const tasksList = await db.collection("TasksList").findOne({ _id: ObjectId(tasksListID) });
        if (!tasksList) return null;

        // check if user already exists in access list
        if (tasksList.accessIDs.find((id) => id.toString() === userID.toString())) {
            return tasksList;
        }

        await db.collection("TasksList").updateOne({ _id: ObjectId(tasksListID) }, { $push: { accessIDs: ObjectId(userID) } });
        const updatedTasksList = await db.collection("TasksList").findOne({ _id: ObjectId(tasksListID) });
        return updatedTasksList;
    },

    /* task */
    createTask: async (_, { title, deadline, note, tasksListID, date }, { db, user }) => {
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
    },

    updateTask: async (_, data, { db, user }) => {
        if (!user) {
            throw new Error("Authentication failed.");
        }
        await db.collection("Tasks").updateOne({ _id: ObjectId(data.id) }, { $set: data });
        const foundTask = await db.collection("Tasks").findOne({ _id: ObjectId(data.id) });
        return foundTask;
    },

    deleteTask: async (_, { id }, { db, user }) => {
        if (!user) {
            throw new Error("Authentication failed.");
        }
        await db.collection("Tasks").deleteOne({ _id: ObjectId(id) });
        return true;
    },
};

module.exports = Mutation;