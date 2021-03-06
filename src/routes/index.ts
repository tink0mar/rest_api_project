import Router from 'koa-router';
import collectionsRouter from './collections.routes';
import usersRouter from './users.routes'
import itemsRouter from './items.routes'

const apiRouter = new Router({
    prefix: "/hnnews"
})


// apend nested to routes to main router

let nestedRoutes = [collectionsRouter, usersRouter, itemsRouter]

for (const router of nestedRoutes) {
    apiRouter.use(router.routes())
}

export default apiRouter;