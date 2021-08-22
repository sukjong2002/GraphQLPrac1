const {PrismaClient} = require('@prisma/client')
const {ApolloServer} = require("apollo-server");
const fs = require("fs");
const path = require("path");

const prisma = new PrismaClient()

const resolvers = {
    Query: {
        load: async (parent, args, context) => {
            const id = args.id;
            const infos = await context.prisma.mod.findUnique({
                where: {id: args.id},
                select: {
                    name: true,
                    birth: true,
                    email: true,
                },
            });
            const email = infos.email
            const birth = infos.birth
            const name = infos.name
            return {
                id,
                email,
                birth,
                name,
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

