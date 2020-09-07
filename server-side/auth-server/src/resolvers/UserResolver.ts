import { Resolver, Query, Mutation, Arg, Ctx, UseMiddleware } from "type-graphql";
import bcryptjs from 'bcryptjs';
import { User } from "../entities/User";
import { RegisterUserInput } from "../models/RegisterUserInput";
import { LoginUserInput } from "../models/LoginUserInput";
import { LoginUserResponse } from "../models/LoginUserResponse";
import { Context } from "../models/Context";
import { TokenService } from "../services/token-service";
import { Authorization } from "../middleware/Authorization";

@Resolver()
export class UserResolver {
    tokens: TokenService = new TokenService();

    @Query(() => String, {
        description: 'Use this query to check if the current user is authorized.'
    })
    @UseMiddleware(Authorization)
    async checkAuth(
        @Ctx() ctx: Context
    ) {
        return `The user with id: ${ ctx.payload?.userID } is authorized.`
    }

    @Query(() => [ User ], { 
        description: 'Use this query to get all registered users.'
    })
    async AllUsers() {
        return await User.find();
    }

    @Query(() => User, { 
        description: 'Use this query to get the registered user with the given id.' 
    })
    async UserByID(
        @Arg('id') id: string
    ) {
        return await User.findOne(id)
    }   

    @Mutation(() => User, {
        description: 'Use this mutation to register a new user.'
    })
    async RegisterUser(
        @Arg('input') { password, firstName, lastName, email }: RegisterUserInput,
    ): Promise<User> {
        const hashedPassword =  await bcryptjs.hash(password, 12)
        const user = User.create({ firstName, lastName, email, password: hashedPassword });
        return await user.save()
    }

    @Mutation(() => LoginUserResponse, {
        description: 'Use this mutation to login a registered user.'
    })
    async LoginUser(
        @Arg('input') { password, email }: LoginUserInput,
        @Ctx() { res }: Context
    ): Promise<LoginUserResponse> {
        const user = await User.findOne({ where: { email }})

        if (!user) {
            throw new Error("User not found.");
        }

        const valid = await bcryptjs.compare(password, user.password);

        if (!valid) {
            throw new Error("bad password.")
        }

        res.cookie('jid', this.tokens.GenerateRefreshToken(user), { httpOnly: true });

        const response = new LoginUserResponse();
        response.accessToken = this.tokens.GenerateAccessToken(user);
        return response;
    }
}