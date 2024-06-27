import Joi from 'joi';
import { IBlogInput } from '../../interfaces';

export default Joi.object<IBlogInput>({
  title: Joi.string().required().max(100),
  description: Joi.string().required(),
});
