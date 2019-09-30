import { MinLength } from 'class-validator';
import { Field, InputType } from 'type-graphql';

@InputType()
export class PasswordInput {
  @Field(() => String)
  @MinLength(5)
  password: string;
}
