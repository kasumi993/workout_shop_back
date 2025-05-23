import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtUser } from '../interfaces/jwt.interfaces';

// Define a proper interface for the request
interface RequestWithUser extends Request {
  user?: JwtUser;
}

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user;

    if (!user || !user.isAdmin) {
      throw new UnauthorizedException('Admin privileges required');
    }

    return true;
  }
}
