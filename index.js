const { PrismaClient } = require('@prisma/client')
const {ApolloServer} = require("apollo-server");
const fs = require("fs");
const path = require("path");

const prisma = new PrismaClient()

const resolvers = {
    Query: {
        info: () => 'GQL API',
        feed: async (parent, args, context) => {
            return context.prisma.link.findMany()
        },
    },
    Mutation: {
        post: (parent, args, context, info) => {
            const newLink = context.prisma.link.create({
                data: {
                    url: args.url,
                    description: args.description,
                },
            })
            return newLink
        },
    },
}

const server = new  ApolloServer({
    typeDefs: fs.readFileSync(
        path.join(__dirname, 'schema.graphql'),
        'utf-8'
    ),
    resolvers,
    context: {
        prisma
    }
})

