import { prisma } from './generated/prisma-client'

// A `main` function so that we can use async/await
async function main() {
  // Create a new user with other details
  const newUser = await prisma.createUser({
    name: 'Oreoluwa',
    email: 'oreoluwade@gmail.com',
    regNo: Date.now().toString(),
    faculty: {
        create: {
            name: 'Technology',
            departments: {
                create: [
                    {
                        name: 'Electronic & Electrical Engineering',
                        courses: {
                            create: [
                                {
                                    name: 'Theory of circuits',
                                    creditUnits: 2,
                                    level: '200',
                                    description: 'An introduction to the theory of circuits'
                                },
                                {
                                    name: 'Vectors',
                                    creditUnits: 1,
                                    level: '100',
                                    description: 'The primal study of vectors in mathematics'
                                },
                            ]
                        }
                    },
                    {
                        name: 'Chemical Engineering',
                        courses: {
                            create: [
                                {
                                    name: 'Engineering Mathematics',
                                    creditUnits: 3,
                                    level: '300',
                                    description: 'A deep dive into orthogonalism in mathematics'
                                },
                                {
                                    name: 'Chemicals',
                                    creditUnits: 2,
                                    level: '200',
                                    description: 'A practical course in the study of chemicals'
                                },
                            ]
                        }
                    },
                    {
                        name: 'Computer Engineering',
                        courses: {
                            create: [
                                {
                                    name: 'Introduction to programming',
                                    creditUnits: 2,
                                    level: '200',
                                    description: 'A cursory study of FORTRAN'
                                },
                                {
                                    name: 'Machine Learning',
                                    creditUnits: 4,
                                    level: '400',
                                    description: 'Exploring AI and machine learning'
                                },
                            ]
                        }
                    },
                    {
                        name: 'Mechanical Engineering',
                        courses: {
                            create: [
                                {
                                    name: 'Engineering Drawing',
                                    creditUnits: 3,
                                    level: '300',
                                    description: 'Engineering and mechnaical drawing'
                                },
                                {
                                    name: 'Trusses',
                                    creditUnits: 2,
                                    level: '200',
                                    description: 'A study of structures and trusses'
                                },
                            ]
                        }
                    },
                ]
            }
        }
    }
  })
  console.log(`Created new user: ${newUser.name} (Registration Number: ${newUser.regNo})`)

  // Read all users from the database and print them to the console
  const allUsers = await prisma.users()
  console.log('USERS', allUsers)

  const allFaculties = await prisma.faculties()
  console.log('FACULTIES', allFaculties)

  const allCourses = await prisma.courses()
  console.log('COURSES: ', allCourses)

  const allDepartments = await prisma.departments()
  console.log('DEPARTMENTS', allDepartments)
}

main().catch(e => console.error(e))