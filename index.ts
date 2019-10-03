const { GraphQLServer } = require('graphql-yoga')
const { prisma } = require('./generated/prisma-client')

const resolvers = {
  Query: {
    user: (_, args, context) => {
      return context.prisma.user({ id: args.id })
    },
    course: (_, { id }, context) => {
      return context.prisma.course({ id })
    },
  },
  Mutation: {
    registerUser: (_, args, context) => {
      return context.prisma.createUser({ ...args })
    },
    updateUserDetails: (_, args, context) => {
    const copiedArgs = JSON.parse(JSON.stringify(args));
    // Did this to prevent faculty and department from being added directly to the update object
    const unconnectedData = Object.entries(copiedArgs).reduce((acc, next) => {
        if(next[0] !== 'department' && next[0] !== 'faculty' && next[0] !== 'id') {
            acc[next[0]] = next[1];
        }
        return acc;
    }, {})

      return prisma.updateUser({
          where: { id: args.id },
          data: {
              ...unconnectedData,
              department: {
                  connect: {
                      id: args.department
                  },
              },
              faculty: {
                connect: {
                    id: args.faculty
                },
              }
          }
      })
    }
  },

  User: {
    courses: ({ id }, args, context) => {
      return context.prisma.user({ id }).courses()
    },
    faculty: ({ id }, args, context) => {
      return context.prisma.user({ id }).faculty()
    },
    department: ({ id }, args, context) => {
      return context.prisma.user({ id }).department()
    },
  },
}

const server = new GraphQLServer({
  typeDefs: './schema.graphql',
  resolvers,
  context: {
    prisma,
  },
})

const options = { port: 4000 };

server.start(options, ({ port }) => console.log(`Server is running on http://localhost:${port}`))