import { Knex } from 'knex';
import { conf } from './conf';

const envs: Record<string, Knex.Config> = {
  development: {
    client: conf.DATA_API_DB_CLIENT || 'mysql2',
    connection: {
      database: conf.DATA_API_DB_NAME || 'TestDB',
      host: process.env.DATA_API_DB_SERVICE_HOST || 'localhost',
      port: Number(conf.DATA_API_DB_PORT) || 3306,
      user: conf.DATA_API_DB_USER || 'root',
      password: conf.DATA_API_DB_PASSWORD || 'mypass',
    },
    migrations: {
      tableName: 'knex_migrations',
      extension: 'ts',
      directory: './../migrations/',
    },
    debug: false,
  },
  production: {
    client: conf.DATA_API_DB_CLIENT || 'mysql2',
    connection: {
      database: conf.DATA_API_DB_NAME || 'TestDB',
      host: process.env.DATA_API_DB_SERVICE_HOST || 'localhost',
      port: Number(conf.DATA_API_DB_PORT) || 3306,
      user: conf.DATA_API_DB_USER || 'root',
      password: conf.DATA_API_DB_PASSWORD || 'mypass',
    },
    migrations: {
      tableName: 'knex_migrations',
      extension: 'ts',
      directory: './../migrations/',
    },
    debug: false,
  },
};

// console.dir(envPath);
// console.log(envs['development']);

export default envs;
