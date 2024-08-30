import { createParamDecorator, ExecutionContext } from '@nestjs/common';
export const UserKey = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const { key } = ctx.switchToHttp().getRequest();

    return key as string;
  },
);
