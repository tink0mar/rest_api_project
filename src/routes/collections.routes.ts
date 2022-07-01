import Router from 'koa-router';
import { validateCreateCollection, validateAddStories} from '../middlewares/validation'
import authenticate from '../middlewares/jwt_middleware'
import { storiesSchema, collectionSchema } from '../validation/collections'
import {
    deleteCollection,
    createCollection,
    listCollections,
    changeCollection,
    addStoriesToCollection,
    getCollection
    } from '../controllers/collection.controller'

import {KoaContext} from '../types/types'
import compose from 'koa-compose'

const router = new Router({
    prefix: "/collections"
})

/**
 * GET - TEST
 */


router.get('/test', authenticate, async(ctx: KoaContext) => {
    ctx.response.status = 200;
})

/**
 * POST - create new collection
 * 
 */

const middlewareCollection = compose([validateCreateCollection, authenticate])

router.post('/', middlewareCollection, createCollection)

/**
 * GET - get all collections for user
 */

router.get('/', authenticate, listCollections)

/**
 * PUT - update collection or create new
 */

router.put('/:id', middlewareCollection, changeCollection)

/**
 * DELETE - collection by id
 * 
 */

router.delete('/:id', authenticate, deleteCollection)

/**
 * GET - get collection by id
 */

router.get('/:id', authenticate, getCollection)

/**
 * POST - fetch stories for given collection
 * 
 */

 const middlewareAddStories = compose([validateAddStories, authenticate])

router.post('/:id', middlewareAddStories, addStoriesToCollection)

export default router