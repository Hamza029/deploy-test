import { HTTPStatusCode } from '../constants';
import AppError from './appError';

class JoiError extends AppError {
  _original: object;
  details: Array<object>;
  constructor(
    _original: object,
    details: Array<object>
  ) {
    super('Validation error', HTTPStatusCode.BadRequest);
    this._original = _original;
    this.details = details;
  }
}

export default JoiError;
