import * as Joi from 'joi';

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
