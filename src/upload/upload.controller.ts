import { Controller, Post, Delete, Param, Req } from '@nestjs/common';
import { Request } from 'express';
import { UploadService } from './upload.service';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}
  // This controller can be extended with methods to handle file uploads
  @Post()
  upload(@Req() request: Request): Promise<{ links: string[] }> {
    return this.uploadService.uploadFiles(request);
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<void> {
    return this.uploadService.deleteFile(id);
  }
}
