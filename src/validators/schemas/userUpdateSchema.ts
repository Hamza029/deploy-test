import Joi from 'joi';
import { IUserUpdateInput } from '../../interfaces';

export default Joi.object<IUserUpdateInput>({
  Name: Joi.string().max(30),
})
  .or('Name')
  .required();
