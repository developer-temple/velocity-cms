import { ObjectType, Field } from "type-graphql";

@ObjectType()
export class LoginUserResponse {
    @Field()
    accessToken: string;
}