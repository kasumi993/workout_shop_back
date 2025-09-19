import { Controller, UseGuards, Req, Get } from '@nestjs/common';
import { Request } from 'express';
import { SupabaseAuthGuard } from './guards/supabase-auth.guard';

@Controller('auth')
export class AuthController {
  @UseGuards(SupabaseAuthGuard)
  @Get('profile')
  getProfile(@Req() req: Request) {
    return req.user;
  }

  @UseGuards(SupabaseAuthGuard)
  @Get('verify')
  verifyToken(@Req() req: Request) {
    return {
      authenticated: true,
      user: req.user
    };
  }
}
