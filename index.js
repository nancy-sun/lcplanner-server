const { ApolloServer, gql } = require("apollo-server");
const dotenv = require("dotenv");
const { MongoClient, ObjectId } = require("mongodb");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { readFileSync } = require("fs");
const typeDefs = readFileSync(require.resolve("./src/schema.graphql")).toString("utf-8");
const Query = require("./src/resolvers/Query");
const Mutation = require("./src/resolvers/Mutation");
const User = require("./src/resolvers/User");
const TasksList = require("./src/resolvers/TasksList");
const Task = require("./src/resolvers/Task");

dotenv.config();


const getUser = async (token, db) => {
    if (!token) return null;
    const tokenData = jwt.verify(token, process.env.JWT_SECRET);
    if (!tokenData?.id) return null;
    return await db.collection("Users").findOne({ _id: ObjectId(tokenData.id) });
}

const run = async () => { // connect to db, then start server
    const client = new MongoClient(process.env.DATABASE_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    const db = client.db(process.env.DATABASE_NAME);
    const server = new ApolloServer({
        typeDefs,
        resolvers: { Query, Mutation, User, TasksList, Task },
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