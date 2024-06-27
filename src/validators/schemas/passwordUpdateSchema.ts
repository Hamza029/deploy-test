import Joi from 'joi';
import { IUpdatePasswordInput } from '../../interfaces';

export default Joi.object<IUpdatePasswordInput>({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string().min(4).required(),
});
