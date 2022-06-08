"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Sub extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Post }) {
      // define association here
      this.hasMany(Post, {
        foreignKey: "subname",
        as: "posts",
        sourceKey: "name",
      });
    }
  }
  Sub.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: { msg: "Sub already exist" },
        validate: {
          len: { args: [3, 20], msg: "Sub Name must between 3-20 char" },
        },
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      uuid: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
      },
      image: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Sub",
      tableName: "subs",
    }
  );
  return Sub;
};
