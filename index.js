require('dotenv').config(); 

const { GraphQLFileLoader } = require('@graphql-tools/graphql-file-loader');
const { loadSchema } = require('@graphql-tools/load');
const { ApolloServer } = require('apollo-server');
const context = require('./config/context');
const resolvers = require('./resolvers');

async function main() {
  const typeDefs = await loadSchema('./schema/*.graphql', {
    loaders: [new GraphQLFileLoader]
  });

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context
  });
  
  server.listen(3000).then(() => {
    console.log('Server open in http://localhost:3000/');
  });
}

main();
