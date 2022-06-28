import jwt, {JwtPayload} from 'jsonwebtoken';
import { CustomError } from './error';
import dotenv from 'dotenv'
import type { KoaContext, Decoded} from '../types/koa_context';
import { Context } from 'koa'


dotenv.config();

const authenticate = (ctx: KoaContext, next: () => Promise<any>) => {
    const token = ctx.request.token;
  
    if (!token) {
        throw new CustomError("Token is required for authentication", 401)
    }

    try {
        
        const decoded = jwt.verify(token, "random-string") as Decoded;
        ctx.request.decoded = decoded;

        console.log("Authorized");
        return next();

    } catch (err) {

        if (err instanceof jwt.TokenExpiredError) {
            
            throw new CustomError("Token expired", 401)

        } else {

            throw new CustomError("Unauthorized", 401)
            
        }
    }
};

export default authenticate