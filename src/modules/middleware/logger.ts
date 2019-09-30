import { MiddlewareFn } from 'type-graphql';
import { MyContext } from '../types/MyContext';

export const logger: MiddlewareFn<MyContext> = async (
  { context, args },
  next
) => {
  console.log(args);
  return next();
};
