const auth = require("../../utils/auth");
const { Sub } = require("../../models/index");
const { UserInputError } = require("apollo-server-core");
const { Op } = require("sequelize");
// const { finished } = require("stream/promises");
const fs = require("fs");
const path = require("path");
// const s = require("../../public/img");
// require("../../public/img")
const makename = require("../../utils/generateRandomStr");

module.exports = {
  Mutation: {
    // create new sub
    createSub: async (_, args, context) => {
      const user = auth(context);
      let { name } = args;
      name = name.trim();
      const errors = {};
      try {
        // check user input name not empty
        if (!name) {
          errors.name = "Sub must have name!";
          throw errors;
        }
        const sub = await Sub.create({ name, username: user.name });
        return sub;
      } catch (error) {
        // console.log(error.name);
        // check sub name is exist already , use sequelize validate
        if (error.name === "SequelizeUniqueConstraintError") {
          error.errors.forEach((err) => {
            errors[err.path] = err.message;
          });
        }
        // check sub name is between 3 and 20 , use sequelize validate
        if (error.name === "SequelizeValidationError") {
          error.errors.forEach((err) => {
            errors[err.path] = err.message;
          });
        }
        throw new UserInputError("Error", { errors });
      }
    },
    searchSub: async (_, args) => {
      const { name } = args;
      try {
        const subs = await Sub.findAll({
          where: {
            name: { [Op.like]: `%${name.trim()}%` },
          },
        });
        return subs;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
    // upload img
    uploadImg: async (_, args, context) => {
      console.log("back");
      const user = auth(context);
      const { subname } = args.input;

      try {
        const { createReadStream, filename, mimetype, encoding } = await args
          .input.file;
        const sub = await Sub.findOne({ where: { name: subname } });
        if (sub.image) {
          const dp = path.join(__dirname, `../../public/img/${sub.image}`);
          fs.unlinkSync(dp);
        }
        const stream = createReadStream();
        const pathName = path.join(__dirname, "../../public/img");
        // console.log(pathName);
        const extname = path.extname(filename);
        // console.log(extname);
        const name = makename(6);
        const pt = `${pathName}/${name}${extname}`;
        const out = fs.createWriteStream(pt);
        await stream.pipe(out);

        sub.image = `${name}${extname}`;
        await sub.save();

        return { pt };
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
  },
  Query: {
    // get sub and post in the sub
    getSubPosts: async (_, args) => {
      const { subname } = args;
      const errors = {};
      try {
        const sub = await Sub.findOne({
          where: { name: subname },
          include: "posts",
          order: [["posts", "createdAt", "DESC"]],
        });
        if (!sub) {
          errors.sub = "sub not exist";
          throw errors;
        }
        return sub;
      } catch (error) {
        console.log(error);
        throw new UserInputError("Error", { errors });
      }
    },
  },
};
