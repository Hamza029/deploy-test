import { Knex } from 'knex';

const userSchema = (table: Knex.CreateTableBuilder) => {
  table.increments('Id').primary().unsigned().unique();
  table.string('Username').notNullable().unique();
  table.string('Email').notNullable().unique();
  table.string('Name').notNullable();
  table.dateTime('JoinDate').notNullable();
  table.integer('Role').notNullable();
};

export default userSchema;
