const { AuthenticationError } = require("apollo-server-core");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// graphql middleware check auth
module.exports = (context) => {
  let token;
  // check req,headers.autorization is exist?
  if (context.req && context.req.headers.authorization) {
    token = context.req.headers.authorization.split(" ")[1];
  }
  if (context.ctx && context.ctx.connectionParams.Authorization) {
    token = context.ctx.connectionParams.Authorization.split(" ")[1];
  }

  if (!token) {
    throw new AuthenticationError("No Auth Token");
  }
  try {
    user = jwt.verify(token, process.env.SECRET);
    return user;
  } catch (error) {
    console.log(error);
    throw new AuthenticationError("Auth failed");
  }
};
