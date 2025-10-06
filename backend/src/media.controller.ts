import { NextFunction, Request, Response } from 'express';
import fs from 'fs';

import logger from './logger.util';
import { MediaService } from './media.service';
import { UploadImageRequest, UploadImageResponse } from './media.types';
import { sanitizeInput } from './sanitizeInput.util';

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export class MediaController {
  private validateImageFile(file: Express.Multer.File): { isValid: boolean; error?: string } {
    // Check file exists
    if (!file) {
      return { isValid: false, error: 'No file uploaded' };
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return { isValid: false, error: 'File size exceeds 5MB limit' };
    }

    // Check MIME type
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      return { isValid: false, error: 'Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed' };
    }

    // Check file actually exists on disk
    if (!fs.existsSync(file.path)) {
      return { isValid: false, error: 'Uploaded file not found' };
    }

    // Basic content validation - check file header
    try {
      const buffer = fs.readFileSync(file.path).slice(0, 10);
      const isValidImageHeader = this.isValidImageHeader(buffer, file.mimetype);
      if (!isValidImageHeader) {
        return { isValid: false, error: 'File content does not match declared type' };
      }
    } catch (error) {
      return { isValid: false, error: 'Unable to validate file content' };
    }

    return { isValid: true };
  }

  private isValidImageHeader(buffer: Buffer, mimeType: string): boolean {
    // Check for common image file signatures
    const signatures: { [key: string]: number[][] } = {
      'image/jpeg': [[0xFF, 0xD8, 0xFF]],
      'image/png': [[0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]],
      'image/gif': [[0x47, 0x49, 0x46, 0x38, 0x37, 0x61], [0x47, 0x49, 0x46, 0x38, 0x39, 0x61]],
      'image/webp': [[0x52, 0x49, 0x46, 0x46], [0x57, 0x45, 0x42, 0x50]]
    };

    const expectedSignatures = signatures[mimeType];
    if (!expectedSignatures) return false;

    return expectedSignatures.some(signature => 
      signature.every((byte, index) => buffer[index] === byte)
    );
  }

  async uploadImage(
    req: Request<unknown, unknown, UploadImageRequest>,
    res: Response<UploadImageResponse>,
    next: NextFunction
  ) {
    try {
      // Validate the uploaded file
      const validation = this.validateImageFile(req.file!);
      if (!validation.isValid) {
        // Clean up the uploaded file if validation fails
        if (req.file && fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
        }
        return res.status(400).json({
          message: validation.error!,
        });
      }

      const user = req.user!;
      const sanitizedFilePath = sanitizeInput(req.file!.path);
      const image = await MediaService.saveImage(
        sanitizedFilePath,
        user._id.toString()
      );

      res.status(200).json({
        message: 'Image uploaded successfully',
        data: {
          image,
        },
      });
    } catch (error) {
      logger.error('Error uploading profile picture:', error);

      // Clean up the uploaded file if an error occurs
      if (req.file && fs.existsSync(req.file.path)) {
        try {
          fs.unlinkSync(req.file.path);
        } catch (cleanupError) {
          logger.error('Failed to clean up uploaded file:', cleanupError);
        }
      }

      if (error instanceof Error) {
        return res.status(500).json({
          message: error.message || 'Failed to upload profile picture',
        });
      }

      next(error);
    }
  }
}
