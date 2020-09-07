import { User } from "../entities/User";
import { sign } from "jsonwebtoken";

export class TokenService {
    constructor() { }
    GenerateAccessToken(u: User, l: string = '15m'): string {
        return sign({ userID: u.id }, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: l }); 
    }

    GenerateRefreshToken(u: User, l: string = '7d'): string {
        return sign({ userID: u.id }, process.env.REFRESH_TOKEN_SECRET!, { expiresIn: l }); 
    }
}