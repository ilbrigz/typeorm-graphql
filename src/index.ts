import 'reflect-metadata';
import { ApolloServer } from 'apollo-server-express';
import Express from 'express';
import { buildSchema } from 'type-graphql';
import { createConnection } from 'typeorm';
import session from 'express-session';
import connectRedis from 'connect-redis';
import { redis } from './redis';
import cors from 'cors';
require('dotenv').config();

const main = async () => {
  await createConnection();

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [__dirname + '/modules/**/*.ts'],
      authChecker: ({ context: { req } }) => {
        return !!req.session.userId;
      },
    }),
    context: ({ req }: any) => ({ req }),
  });

  const app = Express();

  const RedisStore = connectRedis(session);

  app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));

  app.use(
    session({
      store: new RedisStore({
        client: redis as any,
      }),
      name: 'qid',
      secret: 'adsfasdf',
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: false,
        maxAge: 1000 * 60 * 60 * 24 * 7 * 365,
      },
    } as any)
  );

  apolloServer.applyMiddleware({ app });

  app.listen(4000, () => {
    console.log('server started on port 4000');
  });
};

main();
