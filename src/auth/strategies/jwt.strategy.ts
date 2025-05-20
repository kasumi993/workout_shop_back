import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service';
import { JwtPayload, JwtUser } from '../interfaces/jwt.interfaces';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
  ) {
    const jwtSecret = configService.get<string>('JWT_SECRET');
    if (!jwtSecret) {
      throw new Error('JWT_SECRET not found in environment variables');
    }
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    });
  }

  async validate(payload: JwtPayload): Promise<JwtUser> {
    const user = await this.usersService.findOne(payload.sub);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Return a user object that matches the JwtUser interface
    return {
      id: user.id,
      email: user.email,
      name: user.name || null,
      isAdmin: user.isAdmin,
    };
  }
}
