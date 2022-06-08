const express = require("express");
require("dotenv").config();
const { ApolloServer } = require("apollo-server-express");
const { ApolloServerPluginDrainHttpServer } = require("apollo-server-core");
const http = require("http");
const { makeExecutableSchema } = require("@graphql-tools/schema");
const { WebSocketServer } = require("ws");
const { useServer } = require("graphql-ws/lib/use/ws");
const cors = require("cors");

const typeDefs = require("./graphql/type-defs");
const resolvers = require("./graphql/resolvers/index");
const { sequelize } = require("./models/index");
const graphqlUploadExpress = require("./node_modules/graphql-upload/graphqlUploadExpress");

const port = process.env.PORT;

const startServer = async (typeDefs, resolvers) => {
  // express
  const app = express();
  app.use(cors());
  app.use(graphqlUploadExpress());
  app.use("/", express.static(__dirname));
  // http server
  const httpServer = http.createServer(app);
  // schema contains typedef & resolvers
  const schema = makeExecutableSchema({ typeDefs, resolvers });
  // ws server with http server
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: "/graphql",
  });
  // use sever
  const serverCleanup = useServer(
    {
      schema,
      onConnect: () => console.log("sub on"),
      context: (ctx) => {
        // console.log({ ctx });
        return { ctx };
      },
      onDisconnect: () => console.log("sub down"),
    },
    wsServer
  );
  // apollo server
  const server = new ApolloServer({
    schema,
    // csrfPrevention: true,
    context: ({ req }) => ({ req }),

    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
    ],
  });
  // server start
  const corsOpt = {
    origin: ["http://localhost:3000", "https://studio.apollographql.com"],
  };
  await server.start();

  server.applyMiddleware({
    app,
    path: "/",
  });

  await sequelize
    .authenticate()
    .then(() => console.log("db connect"))
    .catch((err) => console.log(err));
  httpServer.listen(port, console.log(`server is runing on port : ${port}`));
};

startServer(typeDefs, resolvers);
