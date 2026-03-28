import Joi from 'joi';

export const requestOtpSchema = Joi.object({
  email: Joi.string().email().required(),
});

export const signupSchema = Joi.object({
  firstName: Joi.string().min(2).max(50).required(),
  lastName: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  otp: Joi.string().length(6).required(),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  otp: Joi.string().length(6).required(),
});