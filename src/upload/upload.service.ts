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

        await this.s3Client.send(
          new PutObjectCommand({
            Bucket: this.configService.get('S3_BUCKET'),
            Key: newFileName,
            Body: fileStream,
            ACL: 'public-read',
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            ContentType:
              // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
              mime.lookup(file.originalFilename) || 'application/octet-stream',
          }),
        );

        // Clean up temp file
        fs.unlinkSync(file.path);

        links.push(
          `https://${this.configService.get('S3_BUCKET')}.s3.${this.configService.get('AWS_REGION')}.amazonaws.com/${newFileName}`,
        );
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

    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: this.configService.get('S3_BUCKET'),
        Key: newFileName,
        Body: file.buffer,
        ACL: 'public-read',
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        ContentType:
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
          mime.lookup(file.originalname) || 'application/octet-stream',
      }),
    );

    return `https://${this.configService.get('S3_BUCKET')}.s3.${this.configService.get('AWS_REGION')}.amazonaws.com/${newFileName}`;
  }

  async deleteFile(fileUrl: string): Promise<void> {
    if (!fileUrl) {
      throw new Error('Missing file link to delete');
    }
    console.log('Deleting file from S3:', fileUrl);

    try {
      const parts = fileUrl.split('/');
      const key = parts[parts.length - 1];

      await this.s3Client.send(
        new DeleteObjectCommand({
          Bucket: this.configService.get('S3_BUCKET'),
          Key: key,
        }),
      );
    } catch (error) {
      console.error('Error deleting file from S3:', error);
      throw new Error('Failed to delete file from S3');
    }
  }
}
