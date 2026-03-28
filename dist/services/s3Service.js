"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadFileToS3 = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const uuid_1 = require("uuid");
const s3_1 = require("../configs/s3");
const uploadFileToS3 = async (file) => {
    const s3Client = (0, s3_1.getS3Client)();
    const key = `uploads/${(0, uuid_1.v4)()}-${file.originalname.replace(/\s+/g, '-')}`;
    const command = new client_s3_1.PutObjectCommand({
        Bucket: (0, s3_1.getBucketName)(),
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
    });
    await s3Client.send(command);
    return `https://${(0, s3_1.getBucketName)()}.s3.${(0, s3_1.getAwsRegion)()}.amazonaws.com/${key}`;
};
exports.uploadFileToS3 = uploadFileToS3;
//# sourceMappingURL=s3Service.js.map