import type { Knex } from 'knex';
import userSchema from './schemas/user';
import authSchema from './schemas/auth';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('User', userSchema);
  await knex.schema.createTable('Auth', authSchema);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('User');
  await knex.schema.dropTableIfExists('Auth');
}
