import Collections from '../models/Collections'
import Users from '../models/Users'
import Items from '../models/Items'
import { Item } from '../types/collections.types'
import axios from 'axios'
import { CustomError } from '../middlewares/error'

/**
 * Delete collection from DB
 * @param id 
 * @param collection 
 */

export const deleteCollectionFromDb = async (id: number, collection: Collections) => {

    await collection.$relatedQuery('items').unrelate();

    await Collections.query().delete().where({
        id: id
    })

}

/**
 * Get collection from database by id and userId
 * @param id 
 * @param userId 
 * @returns 
 */
export const getCollectionFromDb = async (id: number, userId: number): Promise<Collections|undefined> => {

    return Collections.query().findOne({
        id: id,
        usersId: userId
    });
}

export const getCollectionsFromDb = async (userId: number) => {

    return Collections.query().select().where({
        usersId: userId
    });

}

/**
 * Get user from Db
 * @param id 
 * @returns 
 */
export const getUserFromDb = async (id: number) => {

    return Users.query().findOne({
        id: id
    })

}

/**
 * Insert Collection to database
 * @param user 
 * @param name 
 * @returns 
 */
export const insertCollectionInDb = async (user: Users, name: string): Promise<Collections> => {

    const collection = await user.$relatedQuery('collections').insertAndFetch({
        name: name 
    }) as Collections
    
    return collection
}

export const updateCollectionInDb = async (id: number, name: string) => {

    return Collections.query().update({
        name: name
    }).where('id', `${id}`).returning("*")  

}

export const getStoriesFromDb = async (collection: Collections) => {

    const stories = await collection.$relatedQuery('items').select().where({
        type: "story"
    }) as Items[]

    return stories

}


async function getIdsPromises(ids: Array<number>){
    const promiseArray = []
    
    if (!ids.length){
        return;
    }

    for (let i = 0; i < ids.length; i++) {
        
        const url = "https://hacker-news.firebaseio.com/v0/item/" + ids[i] + ".json?print=pretty";
        promiseArray.push(
            axios.get<Item>(url)
        )
    }

    return Promise.all(promiseArray)

}



export const addItems = async (collection: Collections, ids: Array<number>, flag: boolean) => {
    
    const result = await getIdsPromises(ids);
    
    if (!result) {
        throw new  CustomError("Internal server error", 500)
    }

    for (let i = 0; i < result?.length; i++) {
        const item = result[i].data;

        // check if item is already in database
        
        if (await Items.query().findById(item.id)){
            
            // relate item to collection

            await collection.$relatedQuery('items').relate(item);
            
            if (item.kids){
            
                await addItems(collection, item.kids, false);
            
            }

            continue;
        }

        // check if promise was succesfull
        if (item){
            
            // if it was called from controller check if give ids are stories

            if (flag){
                if (item.type != "story"){
                    throw new CustomError("Given id is not a story", 400);
                } 
            }

            await Items.query().insert({
                id: item.id,
                author: item.by,
                time: item.time,
                type: item.type
            })

            if (item.type == "story"){
                
                await Items.query().findById(item.id).patch({
                    content: item.title
                })

            } else if (item.type == "comment") {

                await Items.query().findById(item.id).patch({
                    content: item.text,
                    parentId: item.parent
                })

            }

            await collection.$relatedQuery('items').relate(item);
            
            if (item.kids){
                await addItems(collection, item.kids, false)
            }

        }
    }

}


export const checkStories = async(collection: Collections, storiesIds: Array<number>) => {

    const maxItem: number = await axios.get("https://hacker-news.firebaseio.com/v0/maxitem.json?print=pretty");

    for (let i = 0; i < storiesIds.length; i++){

        if ( storiesIds[i] > maxItem ) {
            
            throw new CustomError("Story does not exists", 404);

        } else {

            const story = await collection.$relatedQuery('items').findOne({
                itemsId: storiesIds[i]
            })
            
            if (story){

                throw new CustomError("One of stories already exists", 409);

            }

        }
    }
}