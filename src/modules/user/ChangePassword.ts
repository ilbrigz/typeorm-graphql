import { Resolver, Arg, Mutation, Ctx } from 'type-graphql';
import bcrypt from 'bcryptjs';

import { User } from '../../entity/User';
import { redis } from '../../redis';
import { ChangePasswordInput } from './changePassword/ChangePasswordInput';
import { forgotPasswordPrefix } from '../constants/redisPrefixes';
import { MyContext } from '../types/MyContext';

@Resolver()
export class ChangePassword {
  @Mutation(() => User, { nullable: true })
  async changePassword(
    @Arg('data')
    { token, password }: ChangePasswordInput,
    @Ctx() ctx: MyContext
  ): Promise<User | null> {
    const userId = await redis.get(forgotPasswordPrefix + token);

    if (!userId) {
      return null;
    }

    const user = await User.findOne(userId);

    if (!user) {
      return null;
    }

    await redis.del(forgotPasswordPrefix + token);

    user.password = await bcrypt.hash(password, 12);

    await user.save();

    //logs in the user after changing password
    ctx.req.session!.userId = user.id;

    return user;
  }
}
