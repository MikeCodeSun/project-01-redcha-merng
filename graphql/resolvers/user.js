const { UserInputError } = require("apollo-server-express");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../../models/index");
const auth = require("../../utils/auth");
require("dotenv").config();
const { Op } = require("sequelize");

module.exports = {
  // mutation
  Mutation: {
    // register
    register: async (_, args) => {
      let { name, email, password, image } = args.input;
      name = name.trim();
      const errors = {};
      try {
        // check user register input
        if (name === "") errors.name = "Name must not be empty";
        if (email.trim() === "") errors.email = "Email must not be empty";
        if (image.match(/\.(jpeg|jpg|gif|png)$/) === null)
          errors.image = "Image must valid url";
        if ([...password].length < 6)
          errors.password = "Password must more than 6";
        if (!password) errors.password = "Password must not be null";
        if (Object.keys(errors).length > 0) {
          // throw new UserInputError("Bad Input", { errors });
          throw errors;
        }
        // create user in db
        const user = await User.create({
          name,
          email,
          password,
          image,
        });
        return user;
      } catch (error) {
        console.log(error);
        // use sequelize unique validate set errrors message
        if (error.name === "SequelizeUniqueConstraintError") {
          error.errors.forEach((err) => {
            errors[err.path] = err.message;
          });
        }
        // check is email address valid , or name < 3 char, set errors msg
        if (error.name === "SequelizeValidationError") {
          error.errors.forEach((err) => {
            errors[err.path] = err.message;
          });
        }
        throw new UserInputError("Bad Input", { errors });
      }
    },
    // login user
    login: async (_, args) => {
      const { name, password } = args.input;
      const errors = {};
      try {
        // check user input !
        if (name.trim() === "") errors.name = "Name must not be empty";
        if (!password) errors.password = "Password must not be empty";
        if (Object.keys(errors).length > 0) {
          throw new UserInputError("Error", { errors });
        }
        // check name is in db
        const user = await User.findOne({
          where: { name },
        });
        if (!user) {
          errors.name = "User not exist";
          throw new UserInputError("Error", { errors });
        }
        // check input password is match hash Password
        const valid = await bcryptjs.compare(password, user.password);
        if (!valid) {
          errors.password = "Password not right";
          throw new UserInputError("Error", { errors });
        }
        // generate jwt token
        const token = jwt.sign({ name: user.name, image: user.image }, process.env.SECRET, {
          expiresIn: "1d",
        });
        console.log(user);
        // return user
        return { ...user.toJSON(), token };
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
  },
  // query
  Query: {
    getUsers: async (_, __, context) => {
      // check auth
      const user = auth(context);
      try {
        // find users except login user
        const users = await User.findAll({
          where: {
            name: {
              [Op.ne]: user.name,
            },
          },
        });
        // console.log(users);
        return users;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
  },
};
