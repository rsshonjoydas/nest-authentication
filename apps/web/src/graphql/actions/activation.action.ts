import { DocumentNode, gql } from '@apollo/client';

export const ACTIVATE_USER: DocumentNode = gql`
  mutation ActivateUser($activationToken: String!, $activationCode: String!) {
    activateUser(
      activationDto: {
        activationToken: $activationToken
        activationCode: $activationCode
      }
    ) {
      user {
        name
        email
        createdAt
      }
    }
  }
`;
