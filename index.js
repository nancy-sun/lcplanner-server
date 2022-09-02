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
        friends:[User!]
    }

    type WeeklyTasks {
        id: ID!
        date: [Task!]
        recap: String
    }

    type Task {
        id: ID!
        date: String!
        createdAt: String!
        title: String!
        deadline: String
        recap: String
        isCompleted: Boolean!
        week: WeeklyTasks
    }

    type Query {
        WeeklyTasks: [WeeklyTasks]
    }
`;


const resolvers = {
    Query: {
        WeeklyTasks: () => [],
    },
    Mutation: {
        signUp: async (_, { input }, { db }) => {
            const hashPw = bcrypt.hashSync(input.password); //hash password
            const newUser = { ...input, password: hashPw }; //update password with hashed
            // const result = await db.collection("Users").insertOne(newUser);
            // console.log(result.ops)
            // const user = result.ops[0];
            // return { user, token: "token" }
            return { result }
        },
        signIn: () => { }
    },
    User: {
        // id: ({ _id, id }) => _id || id
        id: (root) => { console.log(root) }
    }
};

const run = async () => {
    const client = new MongoClient(process.env.DATABASE_URI, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
    await client.connect();
    const db = client.db(process.env.DATABASE_NAME);
    const context = { db }
    const server = new ApolloServer({
        typeDefs,
        resolvers,
        context: async ({ req }) => {
            return { db }
        }
    });

    server.listen().then(({ url }) => {
        console.log(`🚀  Server ready at ${url}`);
    });
}

run();