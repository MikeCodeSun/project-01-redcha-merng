import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  split,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { createClient } from "graphql-ws";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { getMainDefinition } from "@apollo/client/utilities";
import createUploadLink from "apollo-upload-client/public/createUploadLink";

const uploadLink = createUploadLink({
  uri: "http://localhost:4000/graphql",
});

// const httpLink = createHttpLink({
//   uri: "http://localhost:4000/",
// });

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

// ws link
const wsLink = new GraphQLWsLink(
  createClient({
    url: "ws://localhost:4000/graphql",
    // on: { connected: (socket) => console.log(socket) },
    connectionParams: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  })
);
// split link
const sliptLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  authLink.concat(uploadLink)
);
const client = new ApolloClient({
  link: sliptLink,
  cache: new InMemoryCache(),
});

export default client;
