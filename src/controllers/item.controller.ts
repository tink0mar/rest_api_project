import Collections from '../models/Collections'
import Users from '../models/Users'
import { CustomError } from '../middlewares/error';
import Items from '../models/Items'
import { createItemStructure,fillArray } from '../services/items.service'
import type { KoaContext,  KoaResponseContext, Decoded} from '../types/types';
import { GetItemRes, ItemParams, GetItems  } from '../types/collections.types';



export const getItem = async (ctx: KoaContext<any, GetItemRes, ItemParams>) => {

    const [item]: GetItems[] = await Items.query().where('items.id',`${ctx.params?.id}`).withGraphJoined('collections(selectId)').
    modifiers({
        selectId(builder) {
          builder.select('id', 'usersId');
        }
    }).where('usersId', `${ctx.decoded.userId}`)

    // check if item is undefined

    if (!item) {
        throw new CustomError("Resource not found for given user", 404);
    }
    
    let result: GetItemRes = {
        id: item.id,
        parentId: item.parentId,
        content: item.content,
        author: item.author,
        time: item.time,
        type: item.type,
        collections: [],
    }

    item.collections?.forEach( (element) => {
        result.collections?.push(element.id)
    })

    const kids = await item.$relatedQuery('child') as Items[];

    ctx.response.status = 200

    if (ctx.query.whole == 'true') {
        
        result.kids = await createItemStructure(kids);

    } else {

        // fill kids array with id of kids
        
        result.kids = fillArray(kids)

    }

    ctx.body = result

}