const { UserInputError } = require("apollo-server-core");
const auth = require("../../utils/auth");
const { Message, User } = require("../../models/index");
const { Op } = require("sequelize");
const { PubSub, withFilter } = require("graphql-subscriptions");

const pubsub = new PubSub();

module.exports = {
  Mutation: {
    // send message
    sendMessage: async (_, args, context) => {
      const user = auth(context);
      const { content, to } = args.input;
      const errors = {};
      try {
        // check user input content,to who
        if (content.trim() === "") errors.content = "content must not be empty";
        if (to.trim() === "") errors.to = "Message must send to somebody";
        if (Object.keys(errors).length > 0) {
          throw new UserInputError("Error", { errors });
        }
        // check to is user in database
        const toUser = await User.findOne({ where: { name: to } });
        if (!toUser) {
          errors.to = "send to user not exist";
          throw new UserInputError("Error", { errors });
        }
        // check send to not user self
        if (toUser.name === user.name) {
          errors.to = "cant send to youself";
          throw new UserInputError("Error", { errors });
        }
        // craete meassage
        const message = await Message.create({
          content,
          to,
          from: user.name,
        });
        pubsub.publish("NEW_MESSAGE", { newMessage: message });
        return message;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
    // get message mutation
    getMessage: async (_, args, context) => {
      const user = auth(context);
      const { to } = args;
      const errors = {};
      try {
        // check to (include to/from)
        const toUser = await User.findOne({ where: { name: to } });
        if (!toUser) {
          errors.to = "Message must from/to some user in database";
          throw new UserInputError("Error", { errors });
        }
        if (toUser.name === user.name) {
          errors.to = "Message must from/to other user ,not yourser";
          throw new UserInputError("Error", { errors });
        }
        // get message from / to user, from/to to
        const usernames = [toUser.name, user.name];
        console.log(user.name, toUser.name);
        const messages = await Message.findAll({
          where: {
            from: { [Op.or]: usernames },
            to: { [Op.or]: usernames },
          },
          order: [["createdAt", "DESC"]],
        });
        return messages;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
  },
  // query
  // Query: {
  //   getMessage: async (_, args, context) => {
  //     const user = auth(context);
  //     const { to } = args;
  //     const errors = {};
  //     try {
  //       // check to (include to/from)
  //       const toUser = await User.findOne({ where: { name: to } });
  //       if (!toUser) {
  //         errors.to = "Message must from/to some user in database";
  //         throw new UserInputError("Error", { errors });
  //       }
  //       if (toUser.name === user.name) {
  //         errors.to = "Message must from/to other user ,not yourser";
  //         throw new UserInputError("Error", { errors });
  //       }
  //       // get message from / to user, from/to to
  //       const usernames = [toUser.name, user.name];
  //       console.log(user.name, toUser.name);
  //       const messages = await Message.findAll({
  //         where: {
  //           from: { [Op.or]: usernames },
  //           to: { [Op.or]: usernames },
  //         },
  //         order: [["createdAt", "DESC"]],
  //       });
  //       return messages;
  //     } catch (error) {
  //       console.log(error);
  //       throw error;
  //     }
  //   },
  // },
  Subscription: {
    newMessage: {
      // subscribe: () => pubsub.asyncIterator("NEW_MESSAGE"),
      subscribe: withFilter(
        () => pubsub.asyncIterator("NEW_MESSAGE"),
        ({ newMessage }, _, context) => {
          const user = auth(context);
          if (newMessage.from === user.name || newMessage.to === user.name) {
            return true;
          }
          return false;
        }
      ),
    },
  },
};
