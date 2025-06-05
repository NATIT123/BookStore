import {
  createParamDecorator,
  ExecutionContext,
  SetMetadata,
} from '@nestjs/common';

//Gắn metadata cho route hoặc controller để xác định route có được gắn flag IS_PUBLIC_KEY

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

export const RESPONSE_MESSAGE = 'response_message';

export const ResponseMessage = (message: string) =>
  SetMetadata(RESPONSE_MESSAGE, message);

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);

export const IS_PUBLIC_PERMISSION = 'isPublicPermission';
export const SkipCheckPermission = () =>
  SetMetadata(IS_PUBLIC_PERMISSION, true);

// Tạo decorator để gắn metadata 'roles' vào handler
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
