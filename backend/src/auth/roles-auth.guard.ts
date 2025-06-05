import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { Injectable } from '@nestjs/common';

@Injectable()
export class RolesAuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Lấy metadata 'roles' từ handler (route)
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true; // Không yêu cầu vai trò, cho phép truy cập
    }

    // Lấy thông tin user từ request
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Kiểm tra vai trò của user
    return requiredRoles.some((role) => user?.roles?.includes(role));
  }
}
