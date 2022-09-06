const dotenv = require("dotenv");
const { ApolloServer } = require("apollo-server");
const { MongoClient } = require("mongodb");
const { readFileSync } = require("fs");
const typeDefs = readFileSync(require.resolve("./src/schema.graphql")).toString("utf-8");
const resolvers = require("./src/resolvers/resolvers");
const getUser = require("./src/utils/utils").getUser;

dotenv.config();

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