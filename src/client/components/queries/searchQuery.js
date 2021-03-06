import React, { Component } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

const GET_USERS = gql`
  query usersSearch($page: Int, $limit: Int, $text: String!) {
    usersSearch(page: $page, limit: $limit, text: $text) {
      users {
        id
        avatar
        username
      }
    }
  }
`;

export default class UserSearchQuery extends Component {
  getVariables() {
    const { variables } = this.props;
    const queryVariables = {
      page: 0,
      limit: 10,
      text: '',
    };

    if (typeof variables !== typeof undefined) {
      if (typeof variables.page !== typeof undefined) {
        queryVariables.page = variables.page;
      }
      if (typeof variables.limit !== typeof undefined) {
        queryVariables.limit = variables.limit;
      }
      if (typeof variables.text !== typeof undefined) {
        queryVariables.text = variables.text;
      }
    }

    return queryVariables;
  }

  render() {
    const { children } = this.props;
    const variables = this.getVariables();
    const skip = variables.text.length < 3;

    return (
      <Query query={GET_USERS} variables={variables} skip={skip}>
        {({ loading, error, data, fetchMore, refetch }) => {
          if (loading || error || typeof data === typeof undefined) return null;

          const { usersSearch } = data;
          const { users } = usersSearch;

          return React.Children.map(children, function (child) {
            return React.cloneElement(child, { users, fetchMore, variables, refetch });
          });
        }}
      </Query>
    );
  }
}
