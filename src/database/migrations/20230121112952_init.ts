import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('ip', t => {
        t.specificType('ip', 'inet').primary()
        t.json('data').notNullable()
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists('ip')
}

