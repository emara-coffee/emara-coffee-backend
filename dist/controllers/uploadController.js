"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadFiles = void 0;
const s3Service_1 = require("../services/s3Service");
const uploadFiles = async (req, res) => {
    try {
        if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
            res.status(400).json({ message: 'No files uploaded' });
            return;
        }
        const uploadPromises = req.files.map((file) => (0, s3Service_1.uploadFileToS3)(file));
        const fileUrls = await Promise.all(uploadPromises);
        res.status(200).json({ urls: fileUrls });
    }
    catch (error) {
        res.status(500).json({ error });
    }
};
exports.uploadFiles = uploadFiles;
//# sourceMappingURL=uploadController.js.map