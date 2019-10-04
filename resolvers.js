const { prisma } = require('./generated/prisma-client');

module.exports = {
    Query: {
        user: (_, { id }, context) => {
            return context.prisma.user({ id });
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
        createUser: (_, args, context) => {
            return context.prisma.createUser({
                ...args,
                regNo: Date.now().toString()
            });
        },

        createFaculty: (_, { name }, context) => {
            return context.prisma.createFaculty({
                name
            });
        },

        createDepartment: (_, { name, faculty }, context) => {
            return context.prisma.createDepartment({
                name,
                faculty: {
                    connect: { id: faculty }
                }
            });
        },

        createCourse: (_, args, context) => {
            return context.prisma.createCourse({
                name: args.name,
                description: args.description,
                creditUnits: args.creditUnits,
                level: args.level,
                department: {
                    connect: { id: args.department }
                }
            });
        },

        updateUserDetails: (_, args, context) => {
            return prisma.updateUser({
                where: { id: args.id },
                data: {
                    name: args.name,
                    gender: args.gender,
                    address: args.address,
                    phone: args.phone,
                    image: args.image,
                    department: args.department && {
                        connect: { id: args.department }
                    },
                    faculty: args.faculty && {
                        connect: { id: args.faculty }
                    },
                    courses: args.courses && {
                        connect: { id: args.courses }
                    }
                }
            });
        },

        updateDepartment: async (_, { id, name }, context) => {
            return context.prisma.updateDepartment({
                where: { id },
                data: { name }
            });
        },

        updateCourse: (_, { id, name, creditUnits, description }, context) => {
            return context.prisma.updateCourse({
                where: { id },
                data: {
                    name,
                    creditUnits,
                    description
                }
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
        },
        students: ({ id }, args, context) => {
            return context.prisma.faculty({ id }).students();
        }
    }
};
