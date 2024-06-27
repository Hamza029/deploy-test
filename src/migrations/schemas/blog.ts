import { Knex } from 'knex';

const tableSchema = (table: Knex.CreateTableBuilder) => {
  table.increments('id').primary().unsigned();
  table.string('title').notNullable();
  table.text('description').notNullable();
  table.string('authorName').notNullable();
  table.string('authorUsername').notNullable();

  table
    .foreign('authorUsername')
    .references('username')
    .inTable('User')
    .onUpdate('CASCADE')
    .onDelete('CASCADE');
};

export default tableSchema;
