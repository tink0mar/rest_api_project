import Router from 'koa-router';
import { validate } from '../middlewares/validation'
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

import {KoaContext,  KoaResponseContext} from '../types/koa_context'

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

router.post('/', validate(collectionSchema), authenticate, createCollection)

/**
 * GET - get all collections for user
 */

router.get('/', authenticate, listCollections)

/**
 * PUT - update collection or create new
 */

router.put('/', validate(collectionSchema), authenticate, changeCollection)

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

router.post('/:id', validate(storiesSchema), authenticate, addStoriesToCollection)

export default router