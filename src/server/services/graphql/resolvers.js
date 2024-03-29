import Sequelize from 'sequelize';
import bcrypt from 'bcrypt';
import JWT from 'jsonwebtoken';
import logger from '../../helpers/logger';

require('dotenv').config();

const jwtSecret = process.env.JWT_SECRET;
const { Op } = Sequelize;

// cannot use arrow function syntax here since it would automatically take a scope,
// but we want the call function to take over here

export default function resolver() {
  const { db } = this;
  const { Post, User, Chat, Message } = db.models;

  const resolvers = {
    RootMutation: {
      addPost(root, { post }, context) {
        logger.log({ level: 'info', message: 'Post was created!' });
        return User.findAll().then((users) => {
          const userRow = users[0];
          return Post.create({
            ...post,
          }).then((newPost) => {
            return Promise.all([newPost.setUser(userRow.id)]).then(() => {
              return newPost;
            });
          });
        });
      },
      updatePost(root, { post, postId }, context) {
        return Post.update(
          {
            ...post,
          },
          {
            where: {
              id: postId,
            },
          }
        ).then((rows) => {
          if (rows[0] === 1) {
            logger.log({
              level: 'info',
              message: 'Post ' + postId + ' was updated',
            });
            return Post.findByPk(postId);
          }
        });
      },
      deletePost(root, { postId }, context) {
        return Post.destroy({
          where: {
            id: postId,
          },
        }).then(
          (rows) => {
            if (rows === 1) {
              logger.log({
                level: 'info',
                message: 'Post ' + postId + ' was deleted',
              });
              return {
                success: true,
              };
            }
            return {
              success: false,
            };
          },
          (error) => {
            logger.log({
              level: 'error',
              message: error.message,
            });
          }
        );
      },
      addChat(root, { chat }, context) {
        logger.log({ level: 'info', message: 'Chat was created' });
        return Chat.create().then((newChat) => {
          return Promise.all([newChat.setUsers(chat.users)]).then(() => {
            return newChat;
          });
        });
      },
      addMessage(root, { message }, context) {
        logger.log({ level: 'info', message: 'Message was created' });
        return User.findAll().then((users) => {
          const usersRow = users[0];

          return Message.create({
            ...message,
          }).then((newMessage) => {
            return Promise.all([
              newMessage.setUser(usersRow.id),
              newMessage.setChat(message.chatId),
            ]).then(() => {
              return newMessage;
            });
          });
        });
      },
      login(root, { email, password }, context) {
        logger.log({ level: 'info', message: 'User logging in' });
        console.log(email);
        console.log(password);
        console.log('here is the secret', jwtSecret);
        return User.findAll({
          where: {
            email,
          },
          raw: true,
        }).then(async (users) => {
          if (users.length === 1) {
            const user = users[0];
            const passwordValid = await bcrypt.compare(password, user.password);
            if (!passwordValid) {
              throw new Error('Password does not match');
            }
            const token = JWT.sign({ email, id: user.id }, jwtSecret, {
              expiresIn: '1d',
            });

            return {
              token,
            };
          }
          throw new Error('User not found');
        });
      },
      signup(root, { username, email, password }, context) {
        return User.findAll({
          where: {
            [Op.or]: [{ email }, { username }],
          },
          raw: true,
        }).then(async (users) => {
          if (users.length) {
            console.log(users);
            throw new Error('User already exists!');
          } else {
            return bcrypt.hash(password, 10).then((hash) => {
              return User.create({
                email,
                password: hash,
                username,
                activated: 1,
              }).then((newUser) => {
                const token = JWT.sign({ email, id: newUser.id }, jwtSecret, { expiresIn: '1d' });
                return {
                  token,
                };
              });
            });
          }
        });
      },
    },

    Post: {
      user(post, args, context) {
        return post.getUser();
      },
    },

    Message: {
      user(message, args, context) {
        return message.getUser();
      },
      chat(message, args, context) {
        return message.getChat();
      },
    },
    Chat: {
      messages(chat, args, context) {
        return chat.getMessages({ order: [['id', 'ASC']] });
      },
      users(chat, args, context) {
        return chat.getUsers();
      },
      lastMessage(chat, args, context) {
        return chat.getMessages({ limit: 1, order: [['id', 'DESC']] }).then((message) => {
          return message[0];
        });
      },
    },
    RootQuery: {
      posts(root, args, context) {
        return Post.findAll({ order: [['createdAt', 'desc']] });
      },
      postsFeed(root, { page, limit }, context) {
        let skip = 0;

        if (page && limit) {
          skip = page * limit;
        }

        const query = {
          order: [['createdAt', 'DESC']],
          offset: skip,
        };

        if (limit) {
          query.limit = limit;
        }

        return {
          posts: Post.findAll(query),
        };
      },
      chats(root, args, context) {
        return User.findAll().then((users) => {
          if (!users.length) {
            return [];
          }

          const usersRow = users[0];

          return Chat.findAll({
            include: [
              {
                model: User,
                required: true,
                through: { where: { userId: usersRow.id } },
              },
              {
                model: Message,
              },
            ],
          });
        });
      },
      chat(root, { chatId }, context) {
        return Chat.findByPk(chatId, {
          include: [
            {
              model: User,
              required: true,
            },
            {
              model: Message,
            },
          ],
        });
      },
      usersSearch(root, { page, limit, text }, context) {
        if (text.length < 3) {
          return {
            users: [],
          };
        }
        var skip = 0;
        if (page & limit) {
          skip = page * limit;
        }
        const query = {
          order: [['createdAt', 'DESC']],
          offset: skip,
        };
        if (limit) {
          query.limit = limit;
        }
        query.where = {
          username: {
            [Op.like]: `%${text}%`,
          },
        };
        return {
          users: User.findAll(query),
        };
      },
    },
  };

  return resolvers;
}
