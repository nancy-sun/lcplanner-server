const { ApolloServer, gql } = require("apollo-server");
const dotenv = require("dotenv");
const { MongoClient, ObjectId } = require("mongodb");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
dotenv.config();

const typeDefs = gql`

    input SignUpInput {
        email: String!
        password: String!
        name: String!
        avatar: String
    }

    input SignInInput {
        email: String!
        password: String!
    }

    type Mutation{
        signUp(input: SignUpInput!): Auth!
        signIn(input: SignInInput!): Auth!

        createTasksList(recap: String): TasksList!
        updateTasksList(id: ID!, recap: String): TasksList!
    }


    type Auth {
        user: User!
        token: String!
    }

    type User {
        id: ID!
        name: String!
        email: String!
        avatar: String
    }

    type TasksList {
        id: ID!
        recap: String
        progress: Float!
        access:[User!]!
        tasks: [Task!]!
    }

    type Task {
        id: ID!
        date: String!
        title: String!
        deadline: String
        recap: String
        isCompleted: Boolean!
        tasklist: TasksList!
    }

    type Query {
        myTasksList: [TasksList!]!
    }
`;

const getToken = (user) => jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30 days' });

const getUser = async (token, db) => {
    if (!token) return null;
    const tokenData = jwt.verify(token, process.env.JWT_SECRET);
    if (!tokenData?.id) return null;
    return await db.collection("Users").findOne({ _id: ObjectId(tokenData.id) });
}

const resolvers = {
    Query: {
        myTasksList: async (_, __, { db, user }) => {
            if (!user) {
                throw new Error("Authentication failed.");
            }
            return await db.collection("TasksList").find({ accessIDs: user._id }).toArray();

        },
    },
    Mutation: {
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

        createTasksList: async (_, { recap }, { db, user }) => {
            if (!user) {
                throw new Error("Authentication failed.");
            }
            const newTasksList = {
                recap,
                accessIDs: [user._id]
            }
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
        }
    },

    User: {
        id: ({ _id, id }) => _id || id, // id as _id in mongoDB
    },

    TasksList: {
        id: ({ _id, id }) => _id || id, // id as _id in mongoDB
        progress: () => 0,
        access: async ({ accessIDs }, _, { db }) => Promise.all(  // connect with Users collection
            accessIDs.map((accessID) => db.collection("Users").findOne({ _id: accessID }))
        )
    }
};

const run = async () => { // connect to db, then start server
    const client = new MongoClient(process.env.DATABASE_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    const db = client.db(process.env.DATABASE_NAME);
    const server = new ApolloServer({
        typeDefs,
        resolvers,
        context: async ({ req }) => {
            const user = await getUser(req.headers.authorization, db);
            return { db, user };
        }
    });

    server.listen().then(({ url }) => {
        console.log(`🚀  Server ready at ${url}`);
    });
};

run();