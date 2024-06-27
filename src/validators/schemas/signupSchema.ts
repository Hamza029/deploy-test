import Joi from 'joi';
import { IUserInput } from '../../interfaces';

const schema = Joi.object<IUserInput>({
  Username: Joi.string().alphanum().required(),
  Name: Joi.string().required().max(30),
  Email: Joi.string().email().required(),
  Password: Joi.string().min(4).required(),
});

export default schema;
