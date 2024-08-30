import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { getToken } from './auth.util';
@Injectable()
export class JwtAccessGuard extends AuthGuard('accessToken') {
  constructor() {
    super();
  }

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    try {
      const token = getToken(request);
      request.key = token;
      return true;
    } catch (e) {
      return false;
    }
  }
}
