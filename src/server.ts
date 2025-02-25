import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import express, { Express } from "express";
import { PrismaClient } from "@prisma/client";
import { expressMiddleware } from "@apollo/server/express4";

import authMiddleware from "./middlewares/auth.js";
import { errorMiddleware } from "./middlewares/errors.js";
import { connectGraphQLServer } from "./graphql/graphQLServer.js";

dotenv.config({ path: ".env" });

const app: Express = express();
const port = Number(process.env.PORT);

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

export const prismaClient = new PrismaClient({
  log: ["query"],
});

const graphQLServer = connectGraphQLServer();
await graphQLServer.start();
// if (process.env.NODE_ENV === "development") {
//   app.use("/graphql", (req, res, next) => {
//     if (req.method === "GET" && req.headers["accept"]?.includes("text/html")) {
//       return res.status(403).send("GraphQL Playground is disabled");
//     }
//     next();
//   });
// }
app.use(
  "/graphql",
  [authMiddleware],
  expressMiddleware(graphQLServer, {
    context: async ({ req }) => {
      return { user: req.user };
    },
    // context: async ({ req }) => ({ req }),
  })
);

app.use(errorMiddleware);

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
