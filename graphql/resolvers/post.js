const { UserInputError } = require("apollo-server-core");
const auth = require("../../utils/auth");
const { Sub, Post } = require("../../models/index");

module.exports = {
  Mutation: {
    // create new post
    createPost: async (_, args, context) => {
      const user = auth(context);
      const errors = {};
      let { title, body, subname } = args.input;
      title = title.trim();
      body = body || "";
      try {
        // check title not empty
        if (!title) {
          errors.title = "Title must not be empty!";
          throw errors;
        }
        // check sub exist
        const sub = await Sub.findOne({
          where: { name: subname },
        });
        if (!sub) {
          errors.sub = "Sub not exist!";
          throw errors;
        }
        // create post
        const post = await Post.create({
          title,
          body,
          username: user.name,
          subname: sub.name,
        });

        return post;
      } catch (error) {
        console.log(error);
        throw new UserInputError("Error", { errors });
      }
    },
    // delete post
    deletePost: async (_, args, context) => {
      const user = auth(context);
      const { uuid } = args;
      const errors = {};
      try {
        // check post is exist
        const post = await Post.findOne({
          where: { uuid },
        });
        if (!post) {
          errors.post = "post not exist";
          throw errors;
        }
        // check post is created bt user
        if (post.username !== user.name) {
          errors.user = "You are not allowed to delete this post";
          throw errors;
        }
        // delete the post
        await post.destroy();
        return post;
      } catch (error) {
        console.log(error);
        throw new UserInputError("Error", { errors });
      }
    },
    // update post
    updatePost: async (_, args, context) => {
      const user = auth(context);
      let { title, body, postUUID } = args.input;
      title = title.trim();
      body = body.trim();
      const errors = {};
      try {
        // check post
        let post = await Post.findOne({
          where: { uuid: postUUID },
        });
        if (!post) {
          errors.post = "Post not exist!";
          throw errors;
        }
        // check post is created by user
        if (post.username !== user.name) {
          errors.user = "User not allowed to delete";
          throw errors;
        }
        // update post
        const newPost = {
          title: title || post.title,
          body: body || post.body,
        };
        post = await post.update({
          ...newPost,
        });
        return post;
      } catch (error) {
        console.log(error);
        throw new UserInputError("Error", { errors });
      }
    },
  },
  Query: {
    getPost: async (_, args) => {
      const { uuid } = args;
      const errors = {};
      try {
        // find post by uuid & comments belong to post
        const post = await Post.findOne({
          where: { uuid },
          include: ["comments", "votes", "user"],
          order: [["comments", "createdAt", "DESC"]],
        });
        if (!post) {
          errors.post = "Post not exist";
          throw errors;
        }
        return post;
      } catch (error) {
        console.log(error);
        throw new UserInputError("Error", { errors });
      }
    },
    // get all posts
    getAllPosts: async (_, args) => {
      const { limit, offset } = args;
      console.log(limit, offset);
      try {
        const posts = await Post.findAll({
          include: ["comments", "votes", "user", "sub"],
          order: [["createdAt", "DESC"]],
          limit,
          offset,
        });
        return posts;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
    // get posts sub
    getPostsSub: async (_, args) => {
      const { subname } = args;
      try {
        const posts = await Post.findAll({
          where: { subname },
          include: ["comments", "votes", "user", "sub"],
          order: [["createdAt", "DESC"]],
        });
        return posts;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
  },
};
