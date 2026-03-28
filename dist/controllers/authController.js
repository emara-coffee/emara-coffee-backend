"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.signup = exports.requestOtp = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const drizzle_orm_1 = require("drizzle-orm");
const db_1 = require("../configs/db");
const schema_1 = require("../models/schema");
const redis_1 = require("../configs/redis");
const email_1 = __importDefault(require("../configs/email"));
const otp_1 = require("../utils/otp");
const jwt_1 = require("../utils/jwt");
const requestOtp = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            res.status(400).json({ message: 'Email is required' });
            return;
        }
        const otp = (0, otp_1.generateOTP)();
        console.log(otp);
        await redis_1.redisClient.setEx(`otp:${email}`, 300, otp);
        const html = `<h1>Your OTP is ${otp}</h1><p>It expires in 5 minutes.</p>`;
        await email_1.default.sendEmail(email, 'Your OTP Code', html);
        res.status(200).json({ message: 'OTP sent successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error', error });
    }
};
exports.requestOtp = requestOtp;
const signup = async (req, res) => {
    try {
        const { firstName, lastName, email, password, otp } = req.body;
        const storedOtp = await redis_1.redisClient.get(`otp:${email}`);
        if (!storedOtp || storedOtp !== otp) {
            res.status(400).json({ message: 'Invalid or expired OTP' });
            return;
        }
        const existingUser = await db_1.db.select().from(schema_1.users).where((0, drizzle_orm_1.eq)(schema_1.users.email, email));
        if (existingUser.length > 0) {
            res.status(400).json({ message: 'User already exists' });
            return;
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const newUser = await db_1.db.insert(schema_1.users).values({
            firstName,
            lastName,
            email,
            password: hashedPassword,
        }).returning();
        await redis_1.redisClient.del(`otp:${email}`);
        const token = (0, jwt_1.generateToken)(newUser[0].id, newUser[0].role);
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
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error', error });
    }
};
exports.signup = signup;
const login = async (req, res) => {
    try {
        const { email, password, otp } = req.body;
        const storedOtp = await redis_1.redisClient.get(`otp:${email}`);
        if (!storedOtp || storedOtp !== otp) {
            res.status(400).json({ message: 'Invalid or expired OTP' });
            return;
        }
        const user = await db_1.db.select().from(schema_1.users).where((0, drizzle_orm_1.eq)(schema_1.users.email, email));
        if (user.length === 0) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        const isMatch = await bcryptjs_1.default.compare(password, user[0].password);
        if (!isMatch) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }
        await redis_1.redisClient.del(`otp:${email}`);
        const token = (0, jwt_1.generateToken)(user[0].id, user[0].role);
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
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error', error });
    }
};
exports.login = login;
//# sourceMappingURL=authController.js.map