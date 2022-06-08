const { UserInputError } = require("apollo-server-core");
const auth = require("../../utils/auth");
const { Comment, Post } = require("../../models/index");

module.exports = {
  Mutation: {
    createComment: async (_, args, context) => {
      const user = auth(context);
      const { body, postuuid } = args;
      const errors = {};
      try {
        // check user input body
        if (body.trim() === "") {
          errors.comment = "Comment body must not be empty!";
          throw errors;
        }
        //check post is exist?
        const post = await Post.findOne({
          where: { uuid: postuuid },
        });
        if (!post) {
          errors.post = "post not exist!";
          throw errors;
        }
        // create comment
        const comment = await Comment.create({
          body,
          postuuid,
          username: user.name,
        });
        return comment;
      } catch (error) {
        console.log(error);
        throw new UserInputError("Error", { errors });
      }
    },
  },
  Query: {
    getComments: async (_, args) => {
      const { postuuid } = args;

      try {
        const comments = await Comment.findAll({
          where: { postuuid },
          include: "votes",
        });
        return comments;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
  },
};
