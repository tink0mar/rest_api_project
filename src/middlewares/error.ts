import type { Context } from 'koa';

// Custom error for catching knowned errors 

export class CustomError extends Error {  
    statusCode!: number

    constructor (message: string, statusCode: number) {

        super(message)
      
        this.name = this.constructor.name;
        this.statusCode = statusCode

        Error.captureStackTrace(this, this.constructor);
    }

}

export const errorHandler = async (ctx: Context, next: () => Promise<any>) => {

    try {
        // await for next middleware
        await next()

    } catch (err) {
        // catch them all muhahaha

        // custom errors
        if (err instanceof CustomError){
            ctx.response.status = err.statusCode
            ctx.body = {
                "message":err.message,
                "status": err.statusCode
            }
            console.log(err)

        // unknown error
        } else if ( err instanceof Error){
            ctx.response.status = 500
            ctx.body = {
                "messsage": "Internal server error",
                "status": 500
            }
            console.log(err.message)
            console.log(err.stack)
        }
        
    }
}
