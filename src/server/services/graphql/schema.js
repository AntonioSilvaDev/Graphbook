// Be cautious of type vs input, input would be for user input fields
const typeDefinitions = `
  type Post {
    id: Int,
    text: String
    user: User
  }

  input PostInput {
    text: String!
  }

  input ChatInput {
    users: [Int]
  }

  type RootQuery {
    posts: [Post]
    chats: [Chat]
    chat(chatId: Int): Chat
  }

  type User {
    id: Int,
    avatar: String,
    username: String
  }

  input UserInput {
    username: String!,
    avatar: String!
  }

  input MessageInput {
    text: String!,
    chatId: Int!
  }

  type Message {
    id: Int,
    text: String,
    chat: Chat,
    user: User
  }

  type Chat {
    id: Int,
    messages: [Message],
    users: [User],
    lastMessage: Message
  }

  type RootMutation {
    addPost (
      post: PostInput!
    ): Post
    addChat (
      chat: ChatInput!
    ): Chat
    addMessage (
      message: MessageInput!
    ): Message
  }

  schema {
    query: RootQuery
    mutation: RootMutation
  }
`;

export default [typeDefinitions];
