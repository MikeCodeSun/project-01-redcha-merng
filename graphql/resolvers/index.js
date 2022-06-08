const userResolver = require("./user");
const messageResolver = require("./message");
const subResolver = require("./sub");
const postResolver = require("./post");
const commentResolver = require("./comment");
const voteResolver = require("./vote");
const auth = require("../../utils/auth");
const jwtDecode = require("jwt-decode");
const { Vote, User } = require("../../models/index");
const GraphQLUpload = require("../../node_modules/graphql-upload/GraphQLUpload");

module.exports = {
  Upload: GraphQLUpload,
  // post
  Post: {
    createdAt: (parent) => parent.createdAt.toISOString(),
    // get vote +1 and -1 total
    voteValue: (parent) => {
      totalValue = parent.votes?.reduce((total, item) => {
        total += item.value;
        return total;
      }, 0);
      return totalValue;
    },
    // get comment length
    commentsCount: (parent) => parent.comments?.length,
    voteUser: (parent, _, context) => {
      if (context.req && context.req.headers.authorization) {
        const decode = jwtDecode(
          context.req.headers.authorization.split(" ")[1]
        );
        if (decode?.exp * 1000 < Date.now()) {
          return null;
        } else {
          const user = auth(context);
          const index = parent.votes?.findIndex(
            (vote) => vote.username === user.name
          );
          if (index > -1) {
            return parent.votes[index].value;
          }
        }
      }
    },
  },
  // comment
  Comment: {
    createdAt: (parent) => parent.createdAt.toISOString(),
    // votes: async (parent) => {
    //   try {
    //     const votes = await Vote.findAll({
    //       where: { commentuuid: parent.uuid },
    //     });
    //     return votes;
    //   } catch (error) {
    //     console.log(error);
    //     throw error;
    //   }
    // },

    // get vote +1 and -1 total
    voteValue: async (parent) => {
      try {
        const votes = await Vote.findAll({
          where: { commentuuid: parent.uuid },
        });
        totalValue = votes?.reduce((total, item) => {
          total += item.value;
          return total;
        }, 0);
        return totalValue;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
    voteUser: async (parent, _, context) => {
      try {
        const votes = await Vote.findAll({
          where: { commentuuid: parent.uuid },
        });
        if (context.req && context.req.headers.authorization) {
          const user = auth(context);
          const index = votes?.findIndex((vote) => vote.username === user.name);
          if (index > -1) {
            return votes[index].value;
          }
        }
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
    userImg: async (parent) => {
      try {
        const user = await User.findOne({ where: { name: parent.username } });
        return user.image;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
  },
  // vote
  Vote: {
    // get user is vote ,and vote for 1 or -1
    voteUser: (parent, _, context) => {
      if (context.req && context.req.headers.authorization) {
        const user = auth(context);
        if (parent.username === user.name) {
          return parent.value;
        }
      }
    },
    // get post
  },
  // sub
  Sub: {
    posts: (parent) =>
      parent.posts
        // .slice()
        // .reverse()
        .map((post) => post),
  },
  //
  Query: {
    ...userResolver.Query,
    ...messageResolver.Query,
    ...postResolver.Query,
    ...subResolver.Query,
    ...commentResolver.Query,
    ...voteResolver.Query,
  },
  Mutation: {
    ...userResolver.Mutation,
    ...messageResolver.Mutation,
    ...subResolver.Mutation,
    ...postResolver.Mutation,
    ...commentResolver.Mutation,
    ...voteResolver.Mutation,
  },
  Subscription: {
    ...messageResolver.Subscription,
  },
};
