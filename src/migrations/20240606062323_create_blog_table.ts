import { Knex } from 'knex';

import blogSchema from './schemas/blog';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('Blog', blogSchema);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('Blog');
}
