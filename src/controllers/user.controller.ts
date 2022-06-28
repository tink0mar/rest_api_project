import Users from '../models/Users'
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import type { Context } from 'koa';
import { CustomError } from '../middlewares/error';

// add user with encrypted password to database

type UserData = {
    name: string,
    password: string
}

export const registerUser = async (ctx: Context) => {
    
    const inputData: UserData = ctx.request.body;

    const user = await Users.query().findOne({
        username: ctx.request.body.username
    });
    
    if (user){
        throw new CustomError("User already exists", 422)
    }
       
    const encryptedPass = await bcrypt.hash(inputData.password, 10);
    
    const newUser = await Users.query().insert({
        username: ctx.request.body.username,
        password: encryptedPass
    })
    
    ctx.response.status = 201;
    ctx.body = newUser

}

export const loginUser = async (ctx: Context) => {

    const user = await Users.query().findOne({
        username: ctx.request.body.username
    });

    if (!user){
        throw new CustomError("Bad username", 401);
    }
    
    const compare = await bcrypt.compare(ctx.request.body.password, user.password);
    
    if (compare){
        ctx.response.status = 200;

        const token = jwt.sign({
            userId: user.id
          }, "random-string", { expiresIn: "1d" });

        ctx.body = {
            "token": token
        }

    } else {
        throw new CustomError("Bad password", 401);
    }

}