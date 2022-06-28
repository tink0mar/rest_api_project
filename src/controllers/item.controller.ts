import Collections from '../models/Collections'
import Users from '../models/Users'
import type { KoaContext,  KoaResponseContext} from '../types/koa_context';
import { CustomError } from '../middlewares/error';
import Items from '../models/Items'
import { createItemStructure } from '../utils/items.utils'
import { varKinds } from 'ajv/dist/compile/codegen';

interface GetItemParams {
    id?: number
}

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

interface ItemExtension {
    collections?: Array<Collections>
}


export const getItem = async (ctx: KoaContext<any, GetItemRes, GetItemParams>) => {

    const [item]: (Items & ItemExtension)[] = await Items.query().where('items.id',`${ctx.params?.id}`).withGraphJoined('collections(selectId)').
    modifiers({
        selectId(builder) {
          builder.select('id', 'usersId');
        }
    }).where('usersId', `${ctx.request.decoded?.userId}`)

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
        
        let kidsItems: GetItemRes[] = await createItemStructure(kids)
        console.log(kidsItems)
        result.kids = kidsItems;

    } else {

        // fill kids array with id of kids

        let kidsArray: number[] = []

        kids.forEach( (element: Items) => {
            kidsArray.push(element.id)
        })
        
        result.kids = kidsArray

    }

    ctx.body = result

}