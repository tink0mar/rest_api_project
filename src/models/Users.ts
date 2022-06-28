import { Model } from 'objection'
import Collections from './Collections'

export default class Users extends Model {
    id!: number
    username!: string
    password!: string

    static tableName = 'users'
    

    static jsonSchema = {
        type: 'object',
        
        properties: {
            id: {type: 'integer'},
            username: {type: 'string'},
            password: {type: 'string'}
        }
    }

    static relationMappings = () => ({
        collections:{
            relation: Model.HasManyRelation,
            modelClass: Collections,
            join: {
                from: 'users.id',
                to: 'collections.usersId'
            }
        }
    })

}
