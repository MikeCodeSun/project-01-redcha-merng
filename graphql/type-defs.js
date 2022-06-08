const { gql } = require("apollo-server-express");

module.exports = gql`
  scalar Upload

  type User {
    uuid: String!
    name: String!
    email: String!
    password: String
    image: String!
    token: String
  }

  type Message {
    content: String!
    from: String!
    to: String!
    uuid: String!
  }

  type Post {
    uuid: String!
    title: String!
    body: String
    username: String!
    subname: String!
    createdAt: String!
    comments: [Comment]
    commentsCount: Int
    votes: [Vote]
    voteValue: Int
    voteUser: Int
    user: User
    sub: Sub
  }

  type Comment {
    uuid: String!
    body: String!
    username: String!
    postuuid: String!
    createdAt: String!
    votes: [Vote]
    voteValue: Int
    voteUser: Int
    userImg: String
  }

  type Sub {
    uuid: String!
    name: String!
    username: String!
    image: String
    createdAt: String!
    posts: [Post]
  }

  type Vote {
    uuid: String!
    value: Int!
    username: String!
    postuuid: String
    commentuuid: String
    voteUser: Int
    post: Post
  }

  type File {
    pt: String!
  }

  type Query {
    getUsers: [User]!
    getSubPosts(subname: String!): Sub!
    getPost(uuid: String!): Post!
    getComments(postuuid: String!): [Comment]
    getAllPosts(offset: Int!, limit: Int!): [Post]
    getPostsSub(subname: String!): [Post]
    getVote(uuid: String!): Vote!
  }

  input registerInput {
    name: String!
    email: String!
    password: String!
    image: String!
  }

  input loginInput {
    name: String!
    password: String!
  }

  input sendMessageInput {
    content: String!
    to: String!
  }

  input createPostInput {
    title: String!
    subname: String!
    body: String
  }

  input updatePostInput {
    postUUID: String!
    title: String!
    body: String
  }

  input createVoteInput {
    value: Int!
    commentuuid: String
    postuuid: String
  }

  input uploadImgInput {
    subname: String!
    file: Upload
  }

  type Mutation {
    register(input: registerInput!): User!
    login(input: loginInput!): User!
    sendMessage(input: sendMessageInput!): Message!
    getMessage(to: String!): [Message]
    createSub(name: String!): Sub!
    createPost(input: createPostInput!): Post!
    deletePost(uuid: String!): Post!
    updatePost(input: updatePostInput!): Post!
    createComment(body: String!, postuuid: String!): Comment!
    createVote(input: createVoteInput!): Vote!
    searchSub(name: String!): [Sub]
    uploadImg(input: uploadImgInput!): File
  }

  type Subscription {
    newMessage: Message!
  }
`;
