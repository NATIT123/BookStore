import {
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY, IS_PUBLIC_PERMISSION } from 'src/decorator/customize';
import { Request } from 'express';
import { Permission } from 'src/permissions/schemas/permission.schema';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]); //Kiểm tra metadata của route hoặc controller để xem route có được gắn flag IS_PUBLIC_KEY
    if (isPublic) {
      return true; // Nếu route được đánh dấu là "public", bỏ qua xác thực
    }
    return super.canActivate(context); // Thực hiện xác thực thông qua `AuthGuard('jwt')`
  }

  handleRequest(err, user, info, context: ExecutionContext) {
    const request: Request = context.switchToHttp().getRequest();

    // Kiểm tra xem route có gắn metadata IS_PUBLIC_PERMISSION (bỏ qua kiểm tra quyền) hay không.
    // Nếu route này được phép bỏ qua kiểm tra quyền, Guard sẽ không thực hiện kiểm tra permissions.
    const isSkipPermission = this.reflector.getAllAndOverride<boolean>(
      IS_PUBLIC_PERMISSION,
      [context.getHandler(), context.getClass()],
    );

    // You can throw an exception based on either "info" or "err" arguments
    if (err || !user) {
      throw err || new UnauthorizedException('Token is not valid');
    }

    ///Check permissions
    const targetMethod = request.method;
    const targetEndPoint = request.route?.path as string;

    const permisisons = user?.role.permissions ?? [];

    let isExist = permisisons.find(
      (permission: Permission) =>
        permission.method === targetMethod &&
        permission.apiPath === targetEndPoint,
    );

    if (targetEndPoint.startsWith('/api/v1/auth')) isExist = true;
    if (targetEndPoint === '/api/v1/getAllBanks') isExist = true;
    if (
      user?.role.name === 'NORMAL_USER' &&
      targetEndPoint.startsWith('/api/v1/user')
    ) {
      isExist = true;
    }

    if (
      (user?.role.name === 'SUPER_ADMIN' &&
        targetEndPoint.startsWith('/api/v1/admin')) ||
      targetEndPoint.startsWith('/api/v1/database')
    ) {
      isExist = true;
    }

    if (!isExist && !isSkipPermission) {
      throw new ForbiddenException(
        "You don't have permission to access this route",
      );
    }

    return user;
  }
}

// @Injectable()
// export class JwtAuthGuard implements CanActivate {
//   canActivate(context: ExecutionContext): boolean {
//     const request = context.switchToHttp().getRequest();
//     const token = this.extractTokenFromHeader(request);

//     if (!token) {
//       throw new UnauthorizedException('Token not found');
//     }

//     try {
//       // Giải mã và xác minh token
//       const secretKey = 'yourSecretKey'; // Thay bằng khóa bí mật của bạn
//       const decoded = jwt.verify(token, secretKey);

//       // Gắn thông tin user vào request
//       request.user = decoded;
//       return true;
//     } catch (error) {
//       throw new UnauthorizedException('Invalid token');
//     }
//   }

//   private extractTokenFromHeader(request: any): string | null {
//     const authHeader = request.headers['authorization'];
//     if (authHeader && authHeader.startsWith('Bearer ')) {
//       return authHeader.split(' ')[1]; // Tách lấy token sau "Bearer"
//     }
//     return null;
//   }
// }
