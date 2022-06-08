"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Comment, Vote, User, Sub }) {
      // define association here
      this.hasMany(Comment, {
        foreignKey: "postuuid",
        sourceKey: "uuid",
        as: "comments",
      });
      this.hasMany(Vote, {
        foreignKey: "postuuid",
        sourceKey: "uuid",
        as: "votes",
      });
      this.belongsTo(User, {
        foreignKey: "username",
        targetKey: "name",
        as: "user",
      });
      this.belongsTo(Sub, {
        foreignKey: "subname",
        targetKey: "name",
        as: "sub",
      });
    }
  }
  Post.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      body: {
        type: DataTypes.STRING,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      subname: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      uuid: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
      },
    },
    {
      sequelize,
      modelName: "Post",
      tableName: "posts",
    }
  );
  return Post;
};
