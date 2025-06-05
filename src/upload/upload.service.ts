import { Injectable } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import * as mime from 'mime-types';
import { ConfigService } from '@nestjs/config';
import * as multiparty from 'multiparty';
import * as fs from 'fs';
import { Request } from 'express';

@Injectable()
export class UploadService {
  private r2Client: S3Client; // Still using S3Client as R2 is S3-compatible

  constructor(private configService: ConfigService) {
    this.r2Client = new S3Client({
      region: 'auto', // R2 uses 'auto' as region
      endpoint: this.configService.get('R2_ENDPOINT'),
      credentials: {
        accessKeyId: this.configService.get('R2_ACCESS_KEY_ID') ?? '',
        secretAccessKey: this.configService.get('R2_SECRET_ACCESS_KEY') ?? '',
      },
    });
  }

  async uploadFiles(request: Request): Promise<{ links: string[] }> {
    const form = new multiparty.Form();
    const { files } = await new Promise<{
      fields: { [key: string]: string[] };
      files: { [key: string]: multiparty.File[] };
    }>((resolve, reject) => {
      form.parse(request, (err, fields, files) => {
        if (err) reject(err);
        else resolve({ fields, files });
      });
    });

    const links: string[] = [];

    // Process all files from all fields
    for (const fieldName in files) {
      const fileArray = files[fieldName];
      for (const file of fileArray) {
        if (!file.originalFilename) {
          throw new Error('Invalid file: missing filename');
        }

        const newFileName = `${Date.now()}-${file.originalFilename}`;
        const fileStream = fs.createReadStream(file.path);

        await this.r2Client.send(
          new PutObjectCommand({
            Bucket: this.configService.get('R2_BUCKET'),
            Key: newFileName,
            Body: fileStream,
            // Note: R2 doesn't support ACL like S3, files are private by default
            // You'll need to set up custom domain or public access if needed
            ContentType:
              mime.lookup(file.originalFilename) || 'application/octet-stream',
          }),
        );

        // Clean up temp file
        fs.unlinkSync(file.path);

        // Use R2 public subdomain
        links.push(`${this.configService.get('R2_PUBLIC_URL')}/${newFileName}`);
      }
    }

    return { links };
  }

  // Keep the original single file upload method for compatibility
  async uploadFile(file: Express.Multer.File): Promise<string> {
    if (!file || !file.originalname || !file.buffer) {
      throw new Error(
        'Invalid file upload: File, filename, or buffer is missing',
      );
    }

    const newFileName = `${Date.now()}-${file.originalname}`;

    await this.r2Client.send(
      new PutObjectCommand({
        Bucket: this.configService.get('R2_BUCKET'),
        Key: newFileName,
        Body: file.buffer,
        ContentType:
          mime.lookup(file.originalname) || 'application/octet-stream',
      }),
    );
    return `${this.configService.get('R2_PUBLIC_URL')}/${newFileName}`;
  }

  async deleteFile(fileUrl: string): Promise<void> {
    if (!fileUrl) {
      throw new Error('Missing file link to delete');
    }
    console.log('Deleting file from R2:', fileUrl);

    try {
      const parts = fileUrl.split('/');
      const key = parts[parts.length - 1];

      await this.r2Client.send(
        new DeleteObjectCommand({
          Bucket: this.configService.get('R2_BUCKET'),
          Key: key,
        }),
      );
    } catch (error) {
      console.error('Error deleting file from R2:', error);
      throw new Error('Failed to delete file from R2');
    }
  }
}
