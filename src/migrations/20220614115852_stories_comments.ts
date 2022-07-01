import { Knex } from "knex";
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
 export async function up(knex: Knex) {
    await knex.schema.createTable('items', table => {
        
        table.integer('id').primary().notNullable();
        table.integer('parentId').
            references('id').
            inTable('items').
            onDelete('SET NULL').nullable();
        table.string('content', 100000);
        table.string('author');
        table.integer('time');
        table.string('type').checkIn(['story', 'comment']);
        
    
    }).createTable('users', table => {
    
        table.increments('id').primary();
        table.string('username');
        table.string('password');
    
    }).createTable('collections', table => {

        table.increments('id').primary();
        table.integer('usersId').
            references('id').
            inTable('users').
            onDelete('SET NULL');
        table.string('name');

    }).createTable('collections_items', table => {

        table.increments('id').primary();
        table.integer('collectionsId').
            references('id').
            inTable('collections').
            onDelete('SET NULL');
        table.integer('itemsId').
            references('id').
            inTable('items').
            onDelete('SET NULL');

    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
 export async function down(knex: Knex) {
    await knex.schema.table('items', (table) => {
        table.dropForeign(['parentId'])    
    })

    await knex.schema.table('collections_items', (table) => {
        table.dropForeign(['collectionsId']);
        table.dropForeign(['itemsId']);
    })

    await knex.schema.table('collections', (table) => {
        table.dropForeign(['usersId']);
    })

    await knex.schema.
    dropTableIfExists('items').
    dropTableIfExists('users').
    dropTableIfExists('collections').
    dropTableIfExists('collections_items')
};
