import { Context, Request } from 'koa';

export type Decoded = {
    userId: number
    iat: number | undefined
    exp: number | undefined    
}

interface KoaRequest<RequestBody = any> extends Request {
    body?: RequestBody;
}

export interface KoaContext<RequestBody = any, ResponseBody = any,ParamsBody = any > extends Context {
    request: KoaRequest<RequestBody>;
    body: ResponseBody;
    decoded: Decoded
    params: ParamsBody
}

export interface KoaResponseContext<ResponseBody> extends KoaContext<any, ResponseBody> {}
