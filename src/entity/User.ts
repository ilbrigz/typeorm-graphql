import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';
import { ObjectType, Field, ID } from 'type-graphql';

@ObjectType()
@Entity('users')
export class User extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column('text')
  firstName: string;

  @Field()
  @Column('text')
  lastName: string;

  @Field({
    description:
      'A Combination of the first name and the last name. Not stored in the DB',
  })
  name: string;

  @Field()
  @Column('text', { unique: true })
  email: string;

  @Column('text')
  password: string;

  @Column('bool', { default: false })
  confirmed: boolean;

  // @Column('int', { default: 0 })
  // tokenVersion: number;
}
