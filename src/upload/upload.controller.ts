import { Controller, Post, Delete, Body, Req } from '@nestjs/common';
import { Request } from 'express';
import { UploadService } from './upload.service';
import { fileDto } from './dto/file.dto';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}
  // This controller can be extended with methods to handle file uploads
  @Post()
  upload(@Req() request: Request): Promise<{ links: string[] }> {
    return this.uploadService.uploadFiles(request);
  }

  @Delete()
  delete(@Body() data: fileDto): Promise<void> {
    return this.uploadService.deleteFile(data.fileUrl);
  }
}
