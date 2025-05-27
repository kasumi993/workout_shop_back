import { IsString } from 'class-validator';

export class fileDto {
  @IsString()
  fileUrl: string;
}
