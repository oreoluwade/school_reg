const { prisma } = require('./generated/prisma-client');

module.exports = {
    Query: {
        user: (_, args, context) => {
            return context.prisma.user({ id: args.id });
        },
        course: (_, { id }, context) => {
            return context.prisma.course({ id });
        },
        courses: (parent, args, context) => {
            return context.prisma.courses();
        },
        departments: (parent, args, context) => {
            return context.prisma.departments();
        },
        faculties: (parent, args, context) => {
            return context.prisma.faculties();
        },
        students: (parent, args, context) => {
            return context.prisma.users();
        }
    },
    Mutation: {
        registerUser: (_, args, context) => {
            return context.prisma.createUser({ ...args });
        },
        updateUserDetails: (_, args, context) => {
            const copiedArgs = JSON.parse(JSON.stringify(args));
            // Did this to prevent faculty and department from being added directly to the update object
            const unconnectedData = Object.entries(copiedArgs).reduce(
                (acc, next) => {
                    if (
                        next[0] !== 'department' &&
                        next[0] !== 'faculty' &&
                        next[0] !== 'id'
                    ) {
                        acc[next[0]] = next[1];
                    }
                    return acc;
                },
                {}
            );

            const getDataVariant = args => {
                let data;
                if ('faculty' in args && !('department' in args)) {
                    data = {
                        ...unconnectedData,
                        faculty: {
                            connect: {
                                id: args.faculty
                            }
                        }
                    };
                }

                if (!('faculty' in args) && 'department' in args) {
                    data = {
                        ...unconnectedData,
                        department: {
                            connect: {
                                id: args.department
                            }
                        }
                    };
                }

                if ('faculty' in args && 'department' in args) {
                    data = {
                        ...unconnectedData,
                        department: {
                            connect: {
                                id: args.department
                            }
                        },
                        faculty: {
                            connect: {
                                id: args.faculty
                            }
                        }
                    };
                }

                if (!('faculty' in args) && !('department' in args)) {
                    data = {
                        ...unconnectedData
                    };
                }

                return data;
            };

            return prisma.updateUser({
                where: { id: args.id },
                data: getDataVariant(args)
            });
        },
        updateDepartment: (parent, { id, name }, context) => {
            return context.prisma.updateDepartment({
                where: { id },
                data: { name }
            });
        }
    },

    User: {
        courses: ({ id }, args, context) => {
            return context.prisma.user({ id }).courses();
        },
        faculty: ({ id }, args, context) => {
            return context.prisma.user({ id }).faculty();
        },
        department: ({ id }, args, context) => {
            return context.prisma.user({ id }).department();
        }
    },

    Department: {
        courses: ({ id }, args, context) => {
            return context.prisma.department({ id }).courses();
        },
        faculty: ({ id }, args, context) => {
            return context.prisma.department({ id }).faculty();
        },
        students: ({ id }, args, context) => {
            return context.prisma.department({ id }).students();
        }
    },

    Course: {
        department: ({ id }, args, context) => {
            return context.prisma.course({ id }).department();
        },
        students: ({ id }, args, context) => {
            return context.prisma.course({ id }).students();
        }
    },

    Faculty: {
        departments: ({ id }, args, context) => {
            return context.prisma.faculty({ id }).departments();
        }
    }
};
