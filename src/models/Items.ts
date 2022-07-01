import { Model } from 'objection'
import Collections from './Collections'

// Model class for Items

export default class Items extends Model {
    id!: number
    content!: string
    author!: string
    time!: number
    type!: string
    parentId!: number

    static tableName = "items";

    static jsonSchema = {
        type: 'object',
        required: ['id'],
        
        properties: {
            id: {type: 'integer'},
            content: {type: 'string'},
            author: {type: 'string'},
            time: {type: 'integer'},
            type: {type: 'string'},
            parentId: {type: 'integer'}
            }
    }

    static relationMappings = () => ({

        collections: {
            relation: Model.ManyToManyRelation,
            modelClass: Collections,
            join: {
                from: 'items.id',
                through: {
                    from: 'collections_items.itemsId',
                    to: 'collections_items.collectionsId'
                },
                to: 'collections.id'
            }
        },

        parent: {
                relation: Model.BelongsToOneRelation,
                modelClass: Items,
                join: {
                    from: 'items.parentId',
                    to: 'items.id'
                }
        },

        child: {
                relation: Model.HasManyRelation,
                modelClass: Items,
                join: {
                    from: 'items.id',
                    to: 'items.parentId'
                }
        }

    })

}
