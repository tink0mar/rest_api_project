
import { registerUser, loginUser} from '../controllers/user.controller'
import Router from 'koa-router'
import { validate } from '../middlewares/validation'

import { userSchema } from '../validation/user'

const router = new Router({
    prefix: '/users'
})

/**
 * POST - register user in database
 * 
 */

router.post('/register', validate(userSchema), registerUser);

/**
 * POST - login user to database
 * 
 * get jwt token on return 
 */

router.post('/login', validate(userSchema), loginUser);

export default router;