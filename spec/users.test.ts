import jasmine from 'jasmine';
import { getToken } from '../src/services/users.service'
import jwt from 'jsonwebtoken'
import { Decoded } from '../src/types/types'

describe('Test test', function() {
    it("test", function() {
        expect(1 === 1).toBeTruthy
    })
})

describe('Basic tests', async () =>{

    it("should return jwt token", () => {
        const userId = 5

        const token = getToken(userId)
        const key = process.env.TOKEN_SECRET as string
        const decoded = jwt.verify(token, key) as Decoded

        expect(decoded.userId).toBe(userId)

    })

}) 