const { ApolloServer, gql } = require("apollo-server");
const dotenv = require("dotenv");
const { MongoClient, ServerApiVersion } = require('mongodb');
dotenv.config();





const books = [
    {
        title: 'The Awakening',
        author: 'Kate Chopin',
    },
    {
        title: 'City of Glass',
        author: 'Paul Auster',
    },
];

const typeDefs = gql`
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
};

const run = async () => {
    const client = new MongoClient(process.env.DATABASE_URI, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
    await client.connect();
    const db = client.db(process.env.DATABASE_NAME);
    const server = new ApolloServer({
        typeDefs,
        resolvers,
    });

    server.listen().then(({ url }) => {
        console.log(`🚀  Server ready at ${url}`);
    });
}

run();