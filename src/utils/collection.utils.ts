import Collections from '../models/Collections'
import Items from '../models/Items'
import axios from 'axios'
import { createTextChangeRange } from 'typescript';
import { CustomError } from '../middlewares/error'

interface Item {
    id: number
    by: string
    time: number
    type: string
    title?: string
    text?: string
    parent?: number
    kids: Array<number>
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



export const addItems = async (collection: Collections, ids: Array<number>) => {
    
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
            
                await addItems(collection, item.kids);
            
            }

            continue;
        }

        // check if promise was succesfull
        if (item){
        
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
                await addItems(collection, item.kids)
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