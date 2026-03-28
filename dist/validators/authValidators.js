"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = exports.signupSchema = exports.requestOtpSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.requestOtpSchema = joi_1.default.object({
    email: joi_1.default.string().email().required(),
});
exports.signupSchema = joi_1.default.object({
    firstName: joi_1.default.string().min(2).max(50).required(),
    lastName: joi_1.default.string().min(2).max(50).required(),
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().min(6).required(),
    otp: joi_1.default.string().length(6).required(),
});
exports.loginSchema = joi_1.default.object({
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().required(),
    otp: joi_1.default.string().length(6).required(),
});
//# sourceMappingURL=authValidators.js.map