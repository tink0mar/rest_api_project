import Collections from '../models/Collections'
import Users from '../models/Users'
import Items from '../models/Items'
import type { KoaContext,  KoaResponseContext, Decoded} from '../types/types';
import { CustomError } from '../middlewares/error';
import { CollectionParams,
        CreateCollectionReq,
        CreateCollectionRes,
        ChangeCollectionReq,
        ChangeCollectionRes,
        ListCollectionsRes,
        GetCollectionRes,
        AddStoriesToCollectionReq,
        AddStoriesToCollectionRes
        } from '../types/collections.types';

import { getCollectionFromDb,
        deleteCollectionFromDb,
        getUserFromDb,
        insertCollectionInDb,
        updateCollectionInDb,
        getCollectionsFromDb,
        getStoriesFromDb,
        checkStories,
        addItems as addStories
        } from '../services/collections.service'


/**
 * Delete collection
 * 
 * @param ctx 
 */


export const deleteCollection = async (ctx: KoaContext<any, any, CollectionParams>) => {

    // get collection from DB

    const collection = await getCollectionFromDb(ctx.params.id, ctx.decoded.userId)

    if (!collection) {
        throw new CustomError("Resource not found", 404);
    }

    // deletion

    await deleteCollectionFromDb(ctx.params.id, collection);

    ctx.response.status = 204

}



/**
 * Create collection for user
 * @param ctx 
 */

export const createCollection = async (ctx: KoaContext<ChangeCollectionReq, CreateCollectionRes, any>) => {

    if (!ctx.request.body) {
        throw new CustomError("Internal server error", 500)
    }

    const collection = await Collections.query().findOne({
        name: ctx.request.body.name,
        usersId: ctx.decoded.userId
    });

    //collection already exists
    if (collection){
        throw new CustomError("Collection already exists for user", 422);
    }

    const user = await getUserFromDb(ctx.decoded.userId)

    // cannot find user in database but it should be
    if (!user){
        throw new CustomError("User is not longer in database", 500);
    }
    
    if (!ctx.request.body) {
        throw new Error()
    }

    // insert collection and create relation between user and collection
    const newCollection = await insertCollectionInDb(user, ctx.request.body?.name)

    ctx.response.status = 201;
    ctx.body = {
        userId: ctx.decoded.userId,
        collectionName: newCollection.name,
        collectionId: newCollection.id
    }

}


/**
 * Change name of the collection or create new
 * 
 * @param ctx 
 */

export const changeCollection = async (ctx: KoaContext<ChangeCollectionReq,ChangeCollectionRes,CollectionParams>) => {

    const collection = await getCollectionFromDb(ctx.params.id, ctx.decoded.userId)
    
    // collection does not exists, needs to be created
    if (!collection){ 

        await createCollection(ctx)

    // collection is going to be changes    
    } else {
        
        if (!ctx.request.body) {
            throw new Error()
        }

        const collection = await Collections.query().findOne({
            name: ctx.request.body.name,
            usersId: ctx.decoded.userId
        });
    
        //collection already exists
        if (collection){
            throw new CustomError("Collection with given already exists for user", 422);
        }

        const [newCollection] = await updateCollectionInDb(ctx.params.id, ctx.request.body?.name)

        ctx.response.status = 200;
        ctx.body = {
            userId: newCollection.usersId,
            collectionName: newCollection.name,
            collectionId: newCollection.id            
        }
    }
}


/**
 * Get all collections
 * 
 * @param ctx 
 */ 

export const listCollections = async (ctx: KoaResponseContext<ListCollectionsRes>) => {

    const ids = await getCollectionsFromDb(ctx.decoded.userId)

    ctx.response.status = 200;

    ctx.body = {
        userId: ctx.decoded.userId,
        data:{
            collections: []
        }
    }

    ids.forEach( (element: Collections ) => {
        ctx.body.data.collections.push(element.id);
    })

}




/**
 * Get content of one collection
 * @param ctx 
 */

export const getCollection = async (ctx: KoaResponseContext<GetCollectionRes>) => {

    const collection = await getCollectionFromDb(ctx.params.id, ctx.decoded.userId) 

    if (!collection){
        throw new CustomError("Collection not found for given user", 404);
    }

    //get stories from db
    const stories = await getStoriesFromDb(collection)
    
    ctx.response.status = 200;
    ctx.body = {
        "userId": ctx.decoded.userId,
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


/**
 * Add stories to collection
 * 
 * @param ctx 
 */

export const addStoriesToCollection = async (ctx: KoaContext<AddStoriesToCollectionReq, 
    AddStoriesToCollectionRes,CollectionParams>) => {

    const collection = await getCollectionFromDb(ctx.params.id, ctx.decoded.userId)

    if (!collection) {
        throw new CustomError("Resource not found", 404);
    }

    if (!ctx.request.body?.ids){
        throw new CustomError("Easter egg, unrecheable code Typescript is madness",500)
    }

    // checks stories if they can be added
    await checkStories(collection, ctx.request.body.ids);

    // fetch all stories and comments
    await addStories(collection, ctx.request.body.ids, true)

    ctx.response.status = 201;
    ctx.body = {
        "userId": ctx.decoded.userId,
        "collectionId": collection.id,
        "collectionName": collection.name,
        "type": "collection",
        "data" : {
            stories: []
        }
    }

    //get all stories

    const stories = await getStoriesFromDb(collection)

    stories.forEach( (element: Items) => {
        ctx.body.data.stories.push(element.id);
    })   

}