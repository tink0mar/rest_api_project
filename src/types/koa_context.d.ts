import { Context, Request } from 'koa';

interface Decoded {
    userId: number
    iat: number | undefined
    exp: number | undefined       
}

interface KoaRequest<RequestBody = any> extends Request {
    body?: RequestBody;
    decoded?: Decoded
}

export interface KoaContext<RequestBody = any, ResponseBody = any, Params = any> extends Context {
    request: KoaRequest<RequestBody>;
    body: ResponseBody;
    params?: Params;
}

export interface KoaResponseContext<ResponseBody> extends KoaContext<any, ResponseBody> {}