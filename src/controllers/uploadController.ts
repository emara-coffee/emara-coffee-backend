import { Request, Response } from 'express';
import { uploadFileToS3 } from '../services/s3Service';

export const uploadFiles = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
      res.status(400).json({ message: 'No files uploaded' });
      return;
    }

    const uploadPromises = (req.files as Express.Multer.File[]).map((file) => uploadFileToS3(file));
    const fileUrls = await Promise.all(uploadPromises);

    res.status(200).json({ urls: fileUrls });
  } catch (error) {
    res.status(500).json({ error });
  }
};