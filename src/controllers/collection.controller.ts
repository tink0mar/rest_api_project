import Collections from '../models/Collections'
import Users from '../models/Users'
import Items from '../models/Items'
import type { KoaContext,  KoaResponseContext} from '../types/koa_context';
import { CustomError } from '../middlewares/error';
import { checkStories, addItems as addStories } from '../utils/collection.utils'

interface CollectionParams {
    id?: number
}

/**
 * Delete collection
 * 
 * @param ctx 
 */

export const deleteCollection = async (ctx: KoaContext<any, any, CollectionParams>) => {

    const collection = await Collections.query().findOne({
        id: ctx.params?.id,
        usersId: ctx.decoded.userId
    })

    if (!collection) {
        throw new CustomError("Resource not found", 404);
    }

    // proceed deletion 

    await collection.$relatedQuery('items').unrelate();

    const deletedCollection = await Collections.query().delete().where({
        id: ctx.params?.id
    })

    ctx.response.status = 204

}


interface CreateCollectionReq {
    name: string
}

interface CreateCollectionRes {
    userId: number | undefined,
    collectionName: string,
    collectionId: number
}

/**
 * Create collection for user
 * @param ctx 
 */

export const createCollection = async (ctx: KoaContext<CreateCollectionReq, CreateCollectionRes>) => {

    const collection = await Collections.query().findOne({
        name: ctx.request.body?.name,
        usersId: ctx.request.decoded?.userId
    });

    //collection already exists
    if (collection){
        throw new CustomError("Collection already exists", 422);
    }

    const user = await Users.query().findOne({
        id: ctx.request.decoded?.userId
    })

    // cannot find user in database but it should be
    if (!user){
        ctx.response.status = 500;
        throw new Error("User is not longer in database");
    }
    
    const newCollection = await user.$relatedQuery('collections').insertAndFetch({
       name: ctx.request.body?.name 
    }) as Collections

    ctx.response.status = 201;
    ctx.body = {
        userId: ctx.request.decoded?.userId,
        collectionName: newCollection.name,
        collectionId: newCollection.id
    }

}


interface ChangeCollectionReq {
    name: string
}

interface ChangeCollectionRes {
    userId: number,
    collectionName: string,
    collectionId: number
}

/**
 * Change name of the collection or create new
 * 
 * @param ctx 
 */

export const changeCollection = async (ctx: KoaContext<ChangeCollectionReq,ChangeCollectionRes,CollectionParams>) => {

    const collection = await Collections.query().findOne({
        id: ctx.params?.id,
        usersId: ctx.request.decoded?.userId
    }) as Collections
    
    if (!collection){ 

        const user = await Users.query().findOne({
            id: ctx.request.decoded?.userId
        })
    
        // cannot find user in database but it should be
        if (!user){
            ctx.response.status = 500;
            throw new Error("User is not longer in database");
        }
        
        const newCollection = await user.$relatedQuery('collections').insertAndFetch({
           name: ctx.request.body?.name 
        }) as Collections


    } else {
                
        const [newCollection] = await Collections.query().update({
            name: ctx.request.body?.name
        }).where('id', `${ctx.params?.id}`).returning("*")  


       ctx.response.status = 200;
        ctx.body = {
            userId: newCollection.usersId,
            collectionName: newCollection.name,
            collectionId: newCollection.id            
        }
    }

}


interface ListCollectionsRes {
    userId: number | undefined,
    data: {
        collections: Array<number>;
    }
}

/**
 * Get all collections
 * 
 * @param ctx 
 */ 

export const listCollections = async (ctx: KoaResponseContext<ListCollectionsRes>) => {

    const ids = await Collections.query().select('id').where({
        usersId: ctx.request.decoded?.userId
    });

    ctx.response.status = 200;

    ctx.body = {
        userId: ctx.request.decoded?.userId,
        data:{
            collections: []
        }
    }

    ids.forEach( (element: Collections ) => {
        ctx.body.data.collections.push(element.id);
    })

}


interface GetCollectionRes {
    userId: number | undefined
    collectionName: string
    collectionId: number
    type: "collection"
    data: {
        stories: Array<number>
    }
}

/**
 * Get content of one collection
 * @param ctx 
 */

export const getCollection = async (ctx: KoaResponseContext<GetCollectionRes>) => {

    const collection = await Collections.query().findOne({
        id: ctx.params.id,
        usersId: ctx.request.decoded?.userId
    }) 

    if (!collection){
        throw new CustomError("Resource not found for given user", 404);
    }

    const stories = await collection.$relatedQuery('items').select().where({
        type: "story"
    }) as Items[]
    
    ctx.response.status = 200;
    ctx.body = {
        "userId": ctx.request.decoded?.userId,
        "collectionId": collection.id,
        "collectionName": collection.name,
        "type": "collection",
        "data" : {
            stories: []
        }
    }

    stories.forEach( (element: Items) => {
        ctx.body.data.stories.push(element.id);
    })   

}


interface AddStoriesToCollectionReq {
    ids?: Array<number>;
}

interface AddStoriesToCollectionRes {
    userId: number | undefined,
    collectionId: number,
    collectionName: string,
    type: "collection",
    data: {
        stories: Array<number>
    }
}

/**
 * Add stories to collection
 * 
 * @param ctx 
 */

export const addStoriesToCollection = async (ctx: KoaContext<AddStoriesToCollectionReq, 
    AddStoriesToCollectionRes,CollectionParams>) => {

    const collection = await Collections.query().findOne({
        id: ctx.params?.id,
        usersId: ctx.request.decoded?.userId
    })

    if (!collection) {

        throw new CustomError("Resource not found", 404);
    
    }

    if (!ctx.request.body?.ids){
        throw new CustomError("Easter egg, unrecheable code Typescript is madness",400)
    }

    // checks stories if they can be added
    await checkStories(collection, ctx.request.body.ids);

    // fetch all stories and comments
    await addStories(collection, ctx.request.body.ids)

    ctx.response.status = 201;
    ctx.body = {
        "userId": ctx.request.decoded?.userId,
        "collectionId": collection.id,
        "collectionName": collection.name,
        "type": "collection",
        "data" : {
            stories: []
        }
    }

    //get all stories

    const stories = await collection.$relatedQuery('items').select()
        .where('type', 'story') as Items[];

    stories.forEach( (element: Items) => {
        ctx.body.data.stories.push(element.id);
    })   

}