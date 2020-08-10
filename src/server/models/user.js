'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
  }
  User.associate = function (models) {
    User.hasMany(models.Post);
    User.belongsToMany(models.Chat, { through: 'users_chats' });
  };
  User.init(
    {
      avatar: DataTypes.STRING,
      username: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'User',
    }
  );
  return User;
};
