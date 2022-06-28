import Router from 'koa-router';
import authenticate from '../middlewares/jwt_middleware'
import { getItem } from '../controllers/item.controller'

const router = new Router({
    prefix: "/items"
})

router.get('/', async (ctx) => {
    ctx.response.status = 200
})

router.get('/:id', authenticate, getItem)

export default router