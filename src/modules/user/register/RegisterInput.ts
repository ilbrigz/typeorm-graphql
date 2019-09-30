import { Length, IsEmail } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import { IsEmailAlreadyExist } from './isEmailAlreadyUsed';
import { PasswordInput } from '../../shared/PasswordInput';

@InputType()
export class RegisterInput extends PasswordInput {
  @Field(() => String)
  @Length(1, 30)
  firstName: string;

  @Field(() => String)
  @Length(1, 255)
  lastName: string;

  @Field(() => String)
  @IsEmail()
  @IsEmailAlreadyExist({
    message: 'Email $value already exists. Choose another name.',
  })
  email: string;
}
