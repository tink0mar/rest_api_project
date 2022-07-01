import Ajv from 'ajv'
import { CustomError } from './error'
import {KoaContext,  KoaResponseContext} from '../types/types'
import { userSchema } from '../validation/user'
import { collectionSchema, storiesSchema} from '../validation/collections'
// Schema for user
const ajv = new Ajv()

export const validateUser =  (ctx: KoaContext, next: () => Promise<any>) => {

    const validate = ajv.compile(userSchema)

    if (validate(ctx.request.body)){
        return next();
    } else {
        throw new CustomError("Data are not valid", 400)
    }

}

export const validateCreateCollection = (ctx: KoaContext, next: () => Promise<any>) => {

    const validate = ajv.compile(collectionSchema)

    if (validate(ctx.request.body)){
        return next();
    } else {
        throw new CustomError("Data are not valid", 400)
    }

}

export const validateAddStories = (ctx: KoaContext, next: () => Promise<any>) => {

    const validate = ajv.compile(storiesSchema)

    if (validate(ctx.request.body)){
        return next();
    } else {
        throw new CustomError("Data are not valid", 400)
    }

}