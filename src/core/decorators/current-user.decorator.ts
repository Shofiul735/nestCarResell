import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: any, ctx: ExecutionContext) => {
    const httpContext = ctx.switchToHttp();
    const req = httpContext.getRequest();
    return req.currentUser;
  },
);
