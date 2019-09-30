import {
  Resolver,
  Query,
  Mutation,
  Arg,
  FieldResolver,
  Root,
  Authorized,
  UseMiddleware,
} from 'type-graphql';
import bcrypt from 'bcryptjs';
import { User } from '../../entity/User';
import { RegisterInput } from './register/RegisterInput';
import { isAuth } from '../middleware/isAuths';
import { logger } from '../middleware/logger';
import { sendEmail } from '../utils/sendEmail';
import { createConfirmationUrl } from '../utils/createConfirmationUrl';

@Resolver(User) //need user to be passed for the @FieldResolver to work
export class Register {
  @Authorized() //one way of protecting query
  @Query(() => String, {
    name: 'helloworld', //replaces the name in graphql
    description: 'this is the description',
  })
  async hello() {
    return 'hello world';
  }

  @UseMiddleware(isAuth, logger) // second way of protecting query
  @Query(() => String, {
    name: 'helloworld2',
    description: 'this is the description',
  })
  async hello2() {
    return 'middleware as auth checker';
  }

  @Query(() => [User])
  async users() {
    return User.find();
  }

  @FieldResolver()
  async name(@Root() parent: User) {
    return `${parent.firstName} ${parent.lastName}`;
  }

  @Mutation(() => User) //for graphql typing
  async register(@Arg('data')
  {
    email,
    firstName,
    lastName,
    password,
  }: RegisterInput): Promise<User> {
    // for typescript typing
    const hashedPassword = await bcrypt.hash(password, 12);
    let user: User;
    try {
      user = await User.create({
        firstName,
        lastName,
        email,
        password: hashedPassword,
      }).save();

      await sendEmail(email, await createConfirmationUrl(user.id));
    } catch (err) {
      console.log(err);
    }
    return user!;
  }
}
