"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAwsRegion = exports.getBucketName = exports.getS3Client = void 0;
require("./env");
const client_s3_1 = require("@aws-sdk/client-s3");
let s3ClientInstance = null;
const getS3Client = () => {
    if (!s3ClientInstance) {
        s3ClientInstance = new client_s3_1.S3Client({
            region: process.env.AWS_REGION,
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            },
        });
    }
    return s3ClientInstance;
};
exports.getS3Client = getS3Client;
const getBucketName = () => {
    return process.env.AWS_S3_BUCKET;
};
exports.getBucketName = getBucketName;
const getAwsRegion = () => {
    return process.env.AWS_REGION;
};
exports.getAwsRegion = getAwsRegion;
//# sourceMappingURL=s3.js.map