import { ApolloServer } from "@apollo/server";

import { graphQLSchema } from "../graphql/schema/schema.js";
import { graphQLResolver } from "../graphql/resolvers/resolvers.js";

export const connectGraphQLServer = () => {
  const graphQLServer = new ApolloServer({
    typeDefs: graphQLSchema,
    resolvers: graphQLResolver,
    introspection: process.env.NODE_ENV === "development",
    formatError: (err) => {
      return {
        message: err.message,
      };
    },
  });

  return graphQLServer;
};
