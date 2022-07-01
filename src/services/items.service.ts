import Items from '../models/Items'
import Collections from '../models/Collections'

interface GetItemRes{
    id: number
    parentId: number
    content: string
    author: string
    time: number
    type: string
    collections?: Array<number>
    kids?: Array<number> | Array<GetItemRes>
}

/**
 * 
 * @param array 
 * @param items 
 * @returns 
 */
export const createItemStructure = async (items: Array<Items>): Promise<Array<GetItemRes>> => {

    if (items.length == 0){
        return [];
    }

    let itemArray: Array<GetItemRes> = []

    for ( const item of items) {

        let resultItem: GetItemRes = {
            id: item.id,
            parentId: item.parentId,
            content: item.content,
            author: item.author,
            time: item.time,
            type: item.type,
        }

        const kids = await item.$relatedQuery('child').select() as Items[]
        
        resultItem.kids = await createItemStructure(kids);
        
        itemArray.push(resultItem)


    }

    return itemArray
}


export const fillArray = <T extends { id: number}>(kids: T[]): Array<number> => {

    let array: Array<number> = []

    kids.forEach( (element: T) => {
        if ('id' in element) {
            array.push(element.id)
        }
    })

    return array

}