import { gql } from "@apollo/client";

export const REGISTER = gql`
  mutation Register($input: registerInput!) {
    register(input: $input) {
      uuid
      name
      image
    }
  }
`;

export const LOGIN = gql`
  mutation Login($input: loginInput!) {
    login(input: $input) {
      uuid
      name
      image
      token
    }
  }
`;

export const GET_USERS = gql`
  query GetUsers {
    getUsers {
      uuid
      name
      image
    }
  }
`;

export const GET_MESSAGE = gql`
  mutation GetMessage($to: String!) {
    getMessage(to: $to) {
      content
      from
      to
      uuid
    }
  }
`;

export const SEND_MESSAGE = gql`
  mutation SendMessage($input: sendMessageInput!) {
    sendMessage(input: $input) {
      content
      from
      to
      uuid
    }
  }
`;

export const NEW_MESSAGE = gql`
  subscription NewMessage {
    newMessage {
      content
      from
      to
      uuid
    }
  }
`;

export const GET_ALL_POSTS = gql`
  query GetAllPosts($limit: Int!, $offset: Int!) {
    getAllPosts(limit: $limit, offset: $offset) {
      uuid
      title
      body
      username
      subname
      createdAt
      commentsCount
      voteValue
      voteUser
      user {
        name
        image
      }
      sub {
        name
      }
    }
  }
`;

export const CREATE_VOTE = gql`
  mutation CreateVote($input: createVoteInput!) {
    createVote(input: $input) {
      uuid
      value
      username
      postuuid
      commentuuid
      voteUser
      post {
        uuid
        title
        body
        username
        subname
        createdAt
        commentsCount
        voteValue
        voteUser
        user {
          name
          image
        }
        sub {
          name
        }
      }
    }
  }
`;

export const GET_POSTS_SUB = gql`
  query GetPostsSub($subname: String!) {
    getPostsSub(subname: $subname) {
      uuid
      body
      title
      username
      subname
      createdAt
      commentsCount
      voteValue
      voteUser
      user {
        image
      }
      sub {
        image
      }
    }
  }
`;

export const CREATE_SUB = gql`
  mutation CreateSub($name: String!) {
    createSub(name: $name) {
      uuid
      name
      username
      image
      createdAt
    }
  }
`;

export const CREATE_POST = gql`
  mutation CreatePost($input: createPostInput!) {
    createPost(input: $input) {
      uuid
      body
      title
      username
      subname
      createdAt
      commentsCount
      voteValue
      voteUser
      user {
        image
      }
    }
  }
`;

export const GET_POST = gql`
  query GetPost($uuid: String!) {
    getPost(uuid: $uuid) {
      uuid
      title
      body
      username
      subname
      createdAt
      comments {
        body
        uuid
        username
        postuuid
        createdAt
        voteValue
        voteUser
        userImg
      }
      voteValue
      voteUser
      user {
        image
      }
      commentsCount
    }
  }
`;

export const CREATE_COMMENT = gql`
  mutation CreateComment($body: String!, $postuuid: String!) {
    createComment(body: $body, postuuid: $postuuid) {
      uuid
      body
      username
      postuuid
      createdAt
      voteValue
      voteUser
    }
  }
`;

export const SEARCH_SUB = gql`
  mutation SearchSub($name: String!) {
    searchSub(name: $name) {
      uuid
      name
    }
  }
`;

export const GET_SUB = gql`
  query GetSubPosts($subname: String!) {
    getSubPosts(subname: $subname) {
      username
      uuid
      name
      image
    }
  }
`;

export const UPLOAD_IMG = gql`
  mutation UploadImg($input: uploadImgInput!) {
    uploadImg(input: $input) {
      pt
    }
  }
`;
