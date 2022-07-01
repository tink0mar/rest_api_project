

export interface UserDataReq {
    username: string,
    password: string
}

export interface RegisterRes {
    userId: number
    username: string,
}

export interface LoginRes {
    userId: number
    username: string
    token: string
}   