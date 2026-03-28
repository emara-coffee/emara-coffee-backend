"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectRedis = exports.redisClient = void 0;
require("./env");
const redis_1 = require("redis");
exports.redisClient = (0, redis_1.createClient)({
    url: process.env.REDIS_URL
});
exports.redisClient.on('error', (err) => console.error(err));
const connectRedis = async () => {
    if (!exports.redisClient.isOpen) {
        await exports.redisClient.connect();
        console.log('Redis connected');
    }
};
exports.connectRedis = connectRedis;
//# sourceMappingURL=redis.js.map