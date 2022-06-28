import Ajv from 'ajv'
import type { Context } from 'koa';
import { CustomError } from './error'
// Schema for user
const ajv = new Ajv()

export const validate = (schema : object) => {
    
    return (ctx: Context, next: () => Promise<any>) => {

        const validateSchema = ajv.compile(schema);
        
        if (validateSchema(ctx.request.body)) {
            console.log("Valid schema")
            return next()
        } else {
            throw new CustomError("Please enter valid data",400)
        }
    }
}