'use client';

import { ApolloProvider } from '@apollo/client';

import { graphqlClient } from '@/graphql/gql.setup';

export function GraphQLProvider({ children }: { children: React.ReactNode }) {
  return <ApolloProvider client={graphqlClient}>{children}</ApolloProvider>;
}
