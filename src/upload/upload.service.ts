// src/upload/upload.service.ts
import { Injectable } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import mime from 'mime-types';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UploadService {
  private s3Client: S3Client;

  constructor(private configService: ConfigService) {
    this.s3Client = new S3Client({
      region: this.configService.get('AWS_REGION') ?? '',
      credentials: {
        accessKeyId: this.configService.get('S3_ACCESS_KEY') ?? '',
        secretAccessKey: this.configService.get('S3_SECRET_KEY') ?? '',
      },
    });
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (!file || !file.originalname || !file.buffer) {
      throw new Error(
        'Invalid file upload: File, filename, or buffer is missing',
      );
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const newFileName = `${Date.now()}-${file.originalname}`;

    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: this.configService.get('S3_BUCKET'),
        Key: newFileName,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        Body: file.buffer,
        ACL: 'public-read',
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, prettier/prettier
        ContentType: mime.lookup(file.originalname) || 'application/octet-stream',
      }),
    );

    return `https://${this.configService.get('S3_BUCKET')}.s3.${this.configService.get('AWS_REGION')}.amazonaws.com/${newFileName}`;
  }

  async deleteFile(fileUrl: string): Promise<void> {
    // Extract key from URL
    const parts = fileUrl.split('/');
    const key = parts[parts.length - 1];

    await this.s3Client.send(
      new DeleteObjectCommand({
        Bucket: this.configService.get('S3_BUCKET'),
        Key: key,
      }),
    );
  }
}
