import { Model } from 'objection'
import Users from './Users'
import Items from './Items'

// model class for Collections

export default class Collections extends Model {
    id!: number
    usersId!: number
    name!: string

    static tableName = "collections";

    static jsonSchema = {
        
        type: 'object',
        required: ['name'],
        
        properties: {
            id: {type: 'integer'},
            usersId: {type: 'integer'},
            name: {type: 'string'},
        }
    }

    static relationMappings = () => ({

        items: {
            relation: Model.ManyToManyRelation,
            modelClass: Items,
            join: {
                from: 'collections.id',
                through: {
                    from: 'collections_items.collectionsId',
                    to: 'collections_items.itemsId'
                },
                to: 'items.id'
            } 
        },

        users: {
            relation: Model.HasOneRelation,
            modelClass: Users,
            join: {
                from: 'collection.usersId',
                to: 'users.id'
            }
        }
        
    })
}
