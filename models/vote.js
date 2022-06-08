"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Vote extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Post }) {
      // define association here
      this.belongsTo(Post, {
        foreignKey: "postuuid",
        targetKey: "uuid",
        as: "post",
      });
    }
  }
  Vote.init(
    {
      uuid: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
      },
      value: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      postuuid: {
        type: DataTypes.UUID,
      },
      commentuuid: {
        type: DataTypes.UUID,
      },
    },
    {
      sequelize,
      modelName: "Vote",
      tableName: "votes",
    }
  );
  return Vote;
};
