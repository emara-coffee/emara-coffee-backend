import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { db } from '../configs/db';
import { users } from '../models/schema';
import { redisClient } from '../configs/redis';
import emailConfig from '../configs/email';
import { generateOTP } from '../utils/otp';
import { generateToken } from '../utils/jwt';

export const requestOtp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;
    if (!email) {
      res.status(400).json({ message: 'Email is required' });
      return;
    }

    const otp = generateOTP();
    console.log(otp)
    await redisClient.setEx(`otp:${email}`, 300, otp);

    const html = `<h1>Your OTP is ${otp}</h1><p>It expires in 5 minutes.</p>`;
    await emailConfig.sendEmail(email, 'Your OTP Code', html);

    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
};

export const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    const { firstName, lastName, email, password, otp } = req.body;

    const storedOtp = await redisClient.get(`otp:${email}`);
    if (!storedOtp || storedOtp !== otp) {
      res.status(400).json({ message: 'Invalid or expired OTP' });
      return;
    }

    const existingUser = await db.select().from(users).where(eq(users.email, email));
    if (existingUser.length > 0) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await db.insert(users).values({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    }).returning();

    await redisClient.del(`otp:${email}`);

    const token = generateToken(newUser[0].id, newUser[0].role);

    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: newUser[0].id,
        firstName: newUser[0].firstName,
        lastName: newUser[0].lastName,
        email: newUser[0].email,
        role: newUser[0].role,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, otp } = req.body;

    const storedOtp = await redisClient.get(`otp:${email}`);
    if (!storedOtp || storedOtp !== otp) {
      res.status(400).json({ message: 'Invalid or expired OTP' });
      return;
    }

    const user = await db.select().from(users).where(eq(users.email, email));
    if (user.length === 0) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user[0].password);
    if (!isMatch) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    await redisClient.del(`otp:${email}`);

    const token = generateToken(user[0].id, user[0].role);

    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user[0].id,
        firstName: user[0].firstName,
        lastName: user[0].lastName,
        email: user[0].email,
        role: user[0].role,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
};