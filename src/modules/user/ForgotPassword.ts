import { Resolver, Arg, Mutation } from 'type-graphql';

import { User } from '../../entity/User';
import { sendEmail } from '../utils/sendEmail';
import { createForgotPasswordUrl } from '../utils/createForgetPasswordUrl';

@Resolver(User)
export class ForgotPasswordResolver {
  @Mutation(() => Boolean)
  async forgotPassword(@Arg('email') email: string): Promise<boolean> {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      throw new Error('User with that email not found');
    }

    await sendEmail(email, await createForgotPasswordUrl(user.id));
    return true;
  }
}
