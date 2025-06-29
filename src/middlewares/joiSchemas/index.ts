import * as Joi from 'joi';
import { Action } from 'src/schemas/enums/action.enum';
import { Resource } from 'src/schemas/enums/resource.enum';

const joiPassword = Joi.string()
  .min(6)
  .message(`Password must be at least ${6} characters long`);
export const signInSchema = Joi.object({
  email: Joi.string().email().required(),
  password: joiPassword.required(),
});

export const signUpSchema = Joi.object({
  email: Joi.string().email().required(),
  username: Joi.string().min(3).required(),
  password: joiPassword.required(),
});

export const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string().uuid().required(),
});

export const createRoleSchema = Joi.object({
  name: Joi.string().min(3).required(),
  permissions: Joi.array()
    .items(
      Joi.object({
        resource: Joi.string()
          .valid(...Object.values(Resource))
          .required(),
        actions: Joi.array()
          .items(Joi.string().valid(...Object.values(Action)))
          .required(),
      }),
    )
    .required(),
});
