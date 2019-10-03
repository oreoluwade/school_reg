const { GraphQLServer } = require('graphql-yoga');
const resolvers = require('./resolvers');
const { prisma } = require('./generated/prisma-client');

const server = new GraphQLServer({
    typeDefs: './schema.graphql',
    resolvers,
    context: {
        prisma
    }
});

const options = { port: 4000 };

server.start(options, ({ port }) =>
    console.log(`Server is running on http://localhost:${port}`)
);
