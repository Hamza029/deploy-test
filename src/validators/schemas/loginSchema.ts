import Joi from 'joi';
import { IAuthInput } from '../../interfaces';

export default Joi.object<IAuthInput>({
  Username: Joi.string().alphanum().required(),
  Password: Joi.string().required(),
});
