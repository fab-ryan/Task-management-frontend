import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  split,
  from,
} from "@apollo/client";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { getMainDefinition } from "@apollo/client/utilities";
import { createClient } from "graphql-ws";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";

// Get the GraphQL endpoint from environment variables
const httpUrl =
  import.meta.env.VITE_GRAPHQL_URL || "http://localhost:4000/graphql";
const wsUrl =
  import.meta.env.VITE_GRAPHQL_WS_URL || "ws://localhost:4000/graphql";

// Create an HTTP link
const httpLink = createHttpLink({
  uri: httpUrl,
});

// Create a WebSocket link
const wsLink = new GraphQLWsLink(
  createClient({
    url: wsUrl,
    connectionParams: () => {
      // Get the authentication token from local storage if it exists
      const token = localStorage.getItem("auth_token");
      return {
        authorization: token ? `Bearer ${token}` : "",
      };
    },
  })
);

// Add authentication token to requests
const authLink = setContext((_, { headers }) => {
  // Get the authentication token from local storage if it exists
  const token = localStorage.getItem("auth_token");

  // Return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

// Error handling link
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path, extensions }) => {
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      );
      console.log(extensions);

      // Handle authentication errors
      if (
        extensions?.code === "UNAUTHORIZED" ||
        extensions?.code === "UNAUTHENTICATED"
      ) {
        // Clear local storage and redirect to login
        localStorage.removeItem("auth_token");
        window.location.href = "/auth";
      }
    });
  }

  if (networkError) {
    console.error(`[Network error]: ${networkError}`);
    // Handle network errors (e.g., show a notification)
  }
});

// Split links based on operation type
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  authLink.concat(httpLink)
);

// Create the Apollo Client instance
export const apolloClient = new ApolloClient({
  link: from([errorLink, splitLink]),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          // Add any field policies here
        },
      },
    },
  }),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: "cache-and-network",
      errorPolicy: "all",
    },
    query: {
      fetchPolicy: "network-only",
      errorPolicy: "all",
    },
    mutate: {
      errorPolicy: "all",
    },
  },
});
