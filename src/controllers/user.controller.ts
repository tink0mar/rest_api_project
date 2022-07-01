import Users from '../models/Users'
import type { Context } from 'koa';
import { CustomError } from '../middlewares/error';
import { KoaContext } from '../types/types';
import { addUser, checkPassword, getToken, findUser} from '../services/users.service'
import { RegisterRes, UserDataReq, LoginRes} from '../types/users.types'

// add user with encrypted password to database

export const registerUser = async (ctx: KoaContext<UserDataReq, RegisterRes>) => {
    
    // check user in db

    if (!ctx.request.body) {
        throw new CustomError("Internal server error", 500)
    }

    const user = await findUser(ctx.request.body.username);
    
    if (user){
        throw new CustomError("User already exists", 422)
    }

    // add user
    let newUser: Users

    if (!ctx.request.body) {
        throw new CustomError("Internal server error", 500)
    }

    newUser = await addUser(ctx.request.body)

    ctx.response.status = 201;

    ctx.body = {
        userId: newUser.id,
        username: newUser.username,
    }

}

export const loginUser = async (ctx: KoaContext<UserDataReq, LoginRes>) => {

    if (!ctx.request.body) {
        throw new CustomError("Internal server error", 500)
    }

    const user = await findUser(ctx.request.body.username);

    if (!user){
        throw new CustomError("Bad username", 401);
    }

    const check = await checkPassword(ctx.request.body.password, user.password)
    
    

    if (check){
        
        const token = getToken(user.id) 

        ctx.response.status = 200;
        ctx.body = {
            userId: user.id,
            username: user.username,
            token: token
        }

    } else {
        throw new CustomError("Bad password", 401);
    }

}