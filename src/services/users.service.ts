import Users from '../models/Users'
import bcrypt from 'bcrypt';
import { UserDataReq} from '../types/users.types'
import jwt from 'jsonwebtoken'

/**
 * Add user to database
 * @param data Data with user information
 * @returns 
 */

export const addUser = async (data: UserDataReq) => {

    const encryptedPass = await bcrypt.hash(data.password, 10);
    
    return await Users.query().insert({
        username: data.username,
        password: encryptedPass
    })

}

export const findUser = async (username: string) => {

    return Users.query().findOne({
        username: username
    });

}
/**
 * Create jwt token
 * 
 * @param userId
 * @returns token
 */

export const getToken = (userId: number): string => {
    const key = process.env.TOKEN_SECRET as string

    return jwt.sign({
        userId: userId
    }, key, { expiresIn: "1d" });

}

/**
 * Check password with bcrypt
 * 
 * @param password plain password
 * @param hash hashed password
 * @returns 
 */

export const checkPassword = async (password: string, hash: string): Promise<boolean> => {

    const compare = await bcrypt.compare(password, hash);

    if (compare){
        return true;
    }

    return false;

}