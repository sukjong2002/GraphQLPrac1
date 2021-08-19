var express = require('express');
var { graphqlHTTP } = require('express-graphql');
var { buildSchema, graphql, GraphQLObjectType, GraphQLString } = require('graphql');
var pg = require('pg');
var joinMonster = require('join-monster');

const dbconf = {
    host: 'localhost',
    user: 'nodetest',
    password: 'test123',
    database: 'seokjong',
    port: 5432
}
const client = new pg.Client(dbconf);
client.connect(err => {
    if(err) {
        console.log('Conn failed: '+err)
    }else{
        console.log('Conn success')
    }
})

const Test = new GraphQLObjectType({
    name: 'test',
    fields: () => ({
        name: {type:GraphQLString},
        birth: {type:GraphQLString},
        email: {type:GraphQLString}
    })
});

const QueryRoot = new graphql.GraphQLObjectType({
    name: 'Query',
    fields: () => ({
        hello: {
            type: graphql.GraphQLString,
            resolve: () => 'Hello, World!'
        },
        users: {
            type: new graphql.GraphQLList(Test),
            resolve: (parent, args, context, resolveInfo) => {
                return joinMonster.default(resolveInfo, {}, sql => {
                    return client.query(sql)
                })
            }
        }
    })
})

var schema = buildSchema(`
  type Query {
    name: String
    birth: String
  }
`);

var root = { 
    hello: () => 'Hello world!',
    test: () => '0406'
 };

var app = express();
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));
app.listen(4000, () => console.log('Now browse to localhost:4000/graphql'));