import {Entity, PrimaryGeneratedColumn, Column, BaseEntity} from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";

@ObjectType()
@Entity()
export class User extends BaseEntity {

    @Field(() => ID)
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Field()
    @Column()
    firstName: string;

    @Field()
    @Column()
    lastName: string;

    @Field()
    name(): string {
        return `${ this.firstName } ${ this.lastName }`
    }

    @Field()
    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column({ default: false })
    confirmed: boolean;
}
