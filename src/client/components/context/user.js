import React, { Component } from 'react';
// const { Provider, Consumer } = createContext();
import { ApolloConsumer } from 'react-apollo';

// switching to Apollo Consumer, doesn't need a Provider
// export class UserProvider extends Component {
//   render() {
//     const { children } = this.props;
//     const user = {
//       username: 'Test User',
//       avatar: '/uploads/avatar1.png',
//     };

//     return <Provider value={user}>{children}</Provider>;
//   }
// }

// export class UserConsumer extends Component {
//   render() {
//     const { children } = this.props;
//     return (
//       <Consumer>
//         {(user) =>
//           React.Children.map(children, function (child) {
//             return React.cloneElement(child, { user });
//           })
//         }
//       </Consumer>
//     );
//   }
// }

export default class UserConsumer extends Component {
  render() {
    const { children } = this.props;
    return (
      <ApolloConsumer>
        {(client) => {
          // Use client.readQuery to get the current user
          const user = {
            username: 'Test User',
            avatar: '/uploads/avatar1.png',
          };

          return React.Children.map(children, function (child) {
            return React.cloneElement(child, { user });
          });
        }}
      </ApolloConsumer>
    );
  }
}
