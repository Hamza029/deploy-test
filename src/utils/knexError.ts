import AppError from './appError';

class KnexError extends AppError {
  code: string;
  errno: number;
  sqlState: number;
  sqlMessage: string;
  sql: string;
  constructor(
    code: string,
    errno: number,
    sqlState: number,
    sqlMessage: string,
    sql: string
  ) {
    super('Database error', 500);
    this.code = code;
    this.errno = errno;
    this.sqlState = sqlState;
    this.sqlMessage = sqlMessage;
    this.sql = sql;
  }
}

export default KnexError;
