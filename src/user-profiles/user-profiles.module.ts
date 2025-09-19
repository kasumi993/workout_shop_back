import { Module } from '@nestjs/common';
import { UserProfilesService } from './user-profiles.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [UserProfilesService],
  exports: [UserProfilesService],
})
export class UserProfilesModule {}