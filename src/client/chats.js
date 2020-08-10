import React, { Component } from 'react';
import gql from 'graphql-tag';
import { Query, Mutation } from 'react-apollo';

const GET_CHATS = gql`
  {
    chats {
      id
      users {
        id
        username
        avatar
      }
      lastMessage {
        text
      }
    }
  }
`;

const GET_CHAT = gql`
  query chat($chatId: Int!) {
    chat(chatId: $chatId) {
      id
      users {
        id
        username
        avatar
      }
      messages {
        id
        text
        user {
          id
        }
      }
    }
  }
`;

const ADD_MESSAGE = gql`
  mutation addMessage($message: MessageInput!) {
    addMessage(message: $message) {
      id
      text
      user {
        id
      }
    }
  }
`;

export default class Chats extends Component {
  state = {
    openChats: [],
    textInputs: {},
  };

  openChat = (id) => {
    var openChats = this.state.openChats.slice();
    var textInputs = Object.assign({}, this.state.textInputs);

    // if the id is not in the array it will return a -1
    if (openChats.indexOf(id) === -1) {
      if (openChats.length > 2) {
        openChats = openChats.slice(1);
      }
      openChats.push(id);
      textInputs[id] = '';
    }

    this.setState({ openChats, textInputs });
  };

  closeChat = (id) => {
    var openChats = this.state.openChats.slice();
    var textInputs = Object.assign({}, this.state.textInputs);

    const index = openChats.indexOf(id);
    openChats.splice(index, 1);
    delete textInputs[id];
    this.setState({ openChats, textInputs });
  };

  onChangeChatInput = (event, id) => {
    event.preventDefault();
    console.log('textInputState: ', textInputs);
    var textInputs = Object.assign({}, this.state.textInputs);

    textInputs[id] = event.target.value;
    this.setState({ textInputs });
  };

  handleKeyPress = (event, id, addMessage) => {
    const self = this;
    var textInputs = Object.assign({}, this.state.textInputs);

    if (event.key == 'Enter' && textInputs[id].length) {
      addMessage({ variables: { message: { text: textInputs[id], chatId: id } } }).then(() => {
        textInputs[id] = '';
        self.setState({ textInputs });
      });
    }
  };

  usernamesToString(users) {
    const userList = users.slice(1);
    var usernamesString = '';

    for (var i = 0; i < userList.length; i++) {
      usernamesString += userList[i].username;
      if (i - 1 === userList.length) {
        usernamesString += ', ';
      }
    }
    return usernamesString;
  }

  shorten(text) {
    if (text.length > 12) {
      return text.substring(0, text.length - 9) + '...';
    }
    return text;
  }

  render() {
    const self = this;
    const { openChats } = this.state;

    return (
      <div className="wrapper">
        <div className="chats">
          <Query query={GET_CHATS}>
            {({ loading, error, data }) => {
              if (loading) return 'Loading...';
              if (error) return error.message;

              const { chats } = data;
              return chats.map((chat, i) => (
                <div key={'chat' + chat.id} className="chat" onClick={() => self.openChat(chat.id)}>
                  <div className="header">
                    <img src={chat.users.length > 2 ? 'public/group.png' : chat.users[1].avatar} />
                    <div>
                      <h2>{this.shorten(this.usernamesToString(chat.users))}</h2>
                      <span>{this.shorten((chat.lastMessage && chat.lastMessage.text) || '')}</span>
                    </div>
                  </div>
                </div>
              ));
            }}
          </Query>
        </div>
        <div className="openChats">
          {openChats.map((chatId, i) => {
            return (
              <Query key={'chatWindow' + chatId} query={GET_CHAT} variables={{ chatId }}>
                {({ loading, error, data }) => {
                  if (loading) return 'Loading...';
                  if (error) return error.message;

                  const { chat } = data;
                  console.log(chat);
                  return (
                    <div className="chatWindow">
                      <div className="header">
                        <span>{chat.users[1].username}</span>
                        <button className="close" onClick={(chatId) => self.closeChat(chatId)}>
                          X
                        </button>
                      </div>
                      <div className="messages">
                        {chat.messages.map((message, j) => {
                          return (
                            <div
                              key={'message' + message.id}
                              className={'message ' + (message.user.id > 1 ? 'left' : 'right')}
                            >
                              {message.text}
                            </div>
                          );
                        })}
                      </div>
                      <Mutation
                        update={(store, { data: { addMessage } }) => {
                          const data = store.readQuery({
                            query: GET_CHAT,
                            variables: {
                              chatId: chat.id,
                            },
                          });
                          data.chat.messages.push(addMessage);
                          store.writeQuery({
                            query: GET_CHAT,
                            variables: { chatId: chat.id },
                            data,
                          });
                        }}
                        mutation={ADD_MESSAGE}
                      >
                        {(addMessage) => (
                          <div className="input">
                            <input
                              type="text"
                              value={this.state.textInputs[chat.id]}
                              onChange={(event) => self.onChangeChatInput(event, chat.id)}
                              onKeyPress={(event) => {
                                self.handleKeyPress(event, chat.id, addMessage);
                              }}
                            />
                          </div>
                        )}
                      </Mutation>
                    </div>
                  );
                }}
              </Query>
            );
          })}
        </div>
      </div>
    );
  }
}
