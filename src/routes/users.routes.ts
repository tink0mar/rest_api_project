
import { registerUser, loginUser} from '../controllers/user.controller'
import Router from 'koa-router'
import { validateUser } from '../middlewares/validation'

const router = new Router({
    prefix: '/users'
})

/**
 * POST - register user in database
 * 
 */

router.post('/register', validateUser, registerUser);

/**
 * POST - login user to database
 * 
 * get jwt token on return 
 */

router.post('/login', validateUser , loginUser);

export default router;