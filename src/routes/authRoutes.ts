import { Router } from 'express';
import { requestOtp, signup, login } from '../controllers/authController';
import { validate } from '../middlewares/validateMiddleware';
import { requestOtpSchema, signupSchema, loginSchema } from '../validators/authValidators';

const router = Router();

router.post('/request-otp', validate(requestOtpSchema), requestOtp);
router.post('/signup', validate(signupSchema), signup);
router.post('/login', validate(loginSchema), login);

export default router;