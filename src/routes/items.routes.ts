import Router from 'koa-router';
import authenticate from '../middlewares/jwt_middleware'
import { getItem } from '../controllers/item.controller'

const router = new Router({
    prefix: "/items"
})


/**
 * GET - get information about item in user collections
 */

router.get('/:id', authenticate, getItem)

export default router