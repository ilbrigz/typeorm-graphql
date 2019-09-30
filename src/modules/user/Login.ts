import { Resolver, Arg, Mutation, Ctx } from 'type-graphql';
import bcrypt from 'bcryptjs';

import { User } from '../../entity/User';
import { MyContext } from '../types/MyContext';

@Resolver(User)
export class Login {
  @Mutation(() => User, { nullable: true })
  async login(
    @Arg('email') email: string,
    @Arg('password') password: string,
    @Ctx() ctx: MyContext
  ): Promise<User | null> {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return null;
    }

    if (!user.confirmed) {
      throw new Error('please confirm your email first');
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return null;
    }

    ctx.req.session!.userId = user.id;

    return user;
  }
}
