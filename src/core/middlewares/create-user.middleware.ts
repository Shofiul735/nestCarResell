import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import * as session from 'express-session';
import { User } from 'src/entities/users/user.entity';

import { UsersService } from 'src/users/users.service';

declare global {
  namespace Express {
    interface Request {
      currentUser?: User;
      userId?: string;
    }
  }
}

declare module 'express-session' {
  interface SessionData {
    userId?: number;
  }
}

@Injectable()
export class CreateUserMiddleware implements NestMiddleware {
  constructor(private readonly userService: UsersService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const { userId } = req.session || {};

    if (userId) {
      const user = await this.userService.findUser(userId);
      req.currentUser = user;
    }
    next();
  }
}
