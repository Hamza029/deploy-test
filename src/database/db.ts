import knex from 'knex';

import knexFile from './../config/knexfile';
import { conf } from '../config/conf';

const NODE_ENV = conf.NODE_ENV || 'development';

const db = knex(knexFile[NODE_ENV]);

export default db;
