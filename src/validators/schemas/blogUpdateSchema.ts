import Joi from 'joi';
import { IBlogUpdateInput } from '../../interfaces';

export default Joi.object<IBlogUpdateInput>({
  title: Joi.string().max(100).allow(null),
  description: Joi.string().allow(null),
})
  .or('title', 'description')
  .required();
