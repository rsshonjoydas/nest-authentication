import { DocumentNode, gql } from '@apollo/client';

export const GET_USER: DocumentNode = gql`
  query {
    getLoggedInUser {
      user {
        id
        name
        email
        password
      }
      accessToken
      refreshToken
    }
  }
`;
