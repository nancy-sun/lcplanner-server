const { ApolloServer, gql } = require("apollo-server");
const dotenv = require("dotenv");
const { MongoClient, ServerApiVersion } = require('mongodb');
const bcrypt = require('bcryptjs');
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
        date: [Task!]
        recap: String
        owner: User!
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
        TasksList: [TasksList]
    }
`;


const resolvers = {
    Query: {
        TasksList: () => [],
    },
    Mutation: {
        signUp: async (_, { input }, { db }) => {
            const hashPw = bcrypt.hashSync(input.password); //hash password
            const newUser = { ...input, password: hashPw }; //update password with hashed
            const result = await db.collection("Users").insertOne(newUser);
            const userID = result.insertedId;
            const foundUser = await db.collection("Users").findOne({ _id: userID });
            return { user: foundUser, token: "tok" };
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
            return { user: foundUser, token: "token" };
        }
    },
    User: {
        id: ({ _id, id }) => _id || id, // id as _id in mongoDB
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
            // const db = db;
            return { db }
        }
    });

    server.listen().then(({ url }) => {
        console.log(`🚀  Server ready at ${url}`);
    });
}

run();