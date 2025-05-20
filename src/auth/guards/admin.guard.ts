import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';

// Define a proper interface for the user
interface UserWithAdmin {
  id: string;
  email: string;
  isAdmin: boolean;
  [key: string]: any; // For any additional properties
}

// Define a proper interface for the request
interface RequestWithUser extends Request {
  user?: UserWithAdmin;
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
