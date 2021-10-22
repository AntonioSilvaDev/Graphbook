import React from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';

const SIGNUP = gql`
  mutation signup($email: String!, $password: String!, $username: String!) {
    signup(email: $email, password: $password, username: $username) {
      token
    }
  }
`;

export default function signupMutation(props) {
  const { children, setLoggedIn } = props;
  return (
    <Mutation
      update={(store, { data: { signup } }) => {
        if (signup.token) {
          localStorage.setItem('jwt', signup.token);
          setLoggedIn(true);
        }
      }}
      mutation={SIGNUP}
    >
      {(signup, { loading, error }) =>
        React.Children.map(children, function (child) {
          return React.cloneElement(child, { signup, loading, error });
        })
      }
    </Mutation>
  );
}
