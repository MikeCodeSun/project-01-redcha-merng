const { UserInputError } = require("apollo-server-core");
const auth = require("../././../utils/auth");
const { Post, Vote, Comment } = require("../../models/index");

module.exports = {
  Query: {
    getVote: async (_, args) => {
      const { uuid } = args;
      try {
        const vote = await Vote.findOne({
          where: { uuid },
          include: "post",
        });
        return vote;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
  },
  Mutation: {
    createVote: async (_, args, context) => {
      const user = auth(context);
      let { value, postuuid, commentuuid } = args.input;
      const errors = {};
      const valuelist = [-1, 1];
      try {
        // check user input value
        if (!valuelist.includes(value)) {
          errors.value = "vote value not valid , must -1 or 1";
          throw errors;
        }
        // check vote for post or comment
        let vote;
        let post = await Post.findOne({ where: { uuid: postuuid } });
        let comment = await Comment.findOne({ where: { uuid: commentuuid } });
        if (!post && !comment) {
          errors.value = "No post and comment to vote";
          throw errors;
        }
        // find comment will vote comment , not have comment will vote for post
        if (!comment) {
          vote = await Vote.findOne({
            where: { postuuid, username: user.name },
            include: "post",
          });
        } else {
          vote = await Vote.findOne({
            where: { commentuuid, username: user.name },
            include: "post",
          });
        }

        //check vote
        if (!vote) {
          if (!comment) {
            vote = await Vote.create(
              { value, username: user.name, postuuid },
              {
                include: "post",
              }
            );
          } else {
            vote = await Vote.create(
              {
                value,
                username: user.name,
                commentuuid,
              },
              {
                include: "post",
              }
            );
          }
        } else if (vote.value === value) {
          await vote.destroy();
        } else if (vote.value !== value) {
          vote.value = value;
          await vote.save();
        }
        return vote;
      } catch (error) {
        console.log(error);
        throw new UserInputError("Error", { errors });
      }
    },
  },
};
