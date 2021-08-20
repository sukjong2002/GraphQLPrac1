const {PrismaClient} = require('@prisma/client')
const {ApolloServer} = require("apollo-server");
const fs = require("fs");
const path = require("path");

const prisma = new PrismaClient()

const resolvers = {
    Query: {
        // id: (args) => args.id(),
        // email: async (parent, args, context) => {
        //     return await context.prisma.mod.findUnique({
        //         where: {id:args.id()},
        //         select: {
        //             email: true,
        //         },
        //     });
        // },
        load: async (parent, args, context) => {
            const id = args.id;
            const email = await context.prisma.mod.findUnique({
                where: {id: args.id},
                select: {
                    email: true,
                },
            }).email;
            return {
                id,
                email
            };
        }
    },
    Mutation: {
        signup: async (parent, args, context, info) => {
            const user = await context.prisma.mod.create({
                data: {...args}
            });
            return "SUCCESS"
        },
    },
}

const server = new ApolloServer({
    typeDefs: fs.readFileSync(
        path.join(__dirname, 'schema.graphql'),
        'utf-8'
    ),
    resolvers,
    context: {
        prisma
    }
})

server.listen().then(({url}) => console.log(`Server is running on ${url}`));

