module.exports = {
  development: {
    username: 'root',
    password: 'password',
    database: 'graphbook_dev',
    host: 'localhost',
    dialect: 'mysql',
    operatorAliases: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  },
  production: {
    host: process.env.hostname,
    usename: process.env.username,
    password: process.env.password,
    database: process.env.database,
    logging: false,
    dialect: 'mysql',
    operatorAliases: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  },
};
