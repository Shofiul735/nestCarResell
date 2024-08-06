import {
  BadRequestException,
  Injectable,
  NotFoundException,
  Scope,
} from '@nestjs/common';
import { randomBytes, scrypt } from 'crypto';
import { promisify } from 'util';
import { UsersService } from './users.service';
import { CreateUserDto } from 'src/dtos/users/create-user.dto';

@Injectable({
  scope: Scope.REQUEST,
})
export class AuthService {
  private readonly _scrypt = promisify(scrypt);

  constructor(private readonly userService: UsersService) {}

  async signup(email: string, password: string) {
    const users = await this.userService.findByEmail(email);
    if (users.length) {
      throw new BadRequestException('Email in use');
    }

    const salt = randomBytes(8).toString('hex');
    const hash = (await this._scrypt(password, salt, 32)) as Buffer;

    const result = salt + '.' + hash.toString('hex');

    const createUser = new CreateUserDto();
    createUser.email = email;
    createUser.password = result;

    const user = await this.userService.createUser(createUser);
    return user;
  }

  async singin(email: string, password: string) {
    const [user] = await this.userService.findByEmail(email);

    if (!user) {
      throw new NotFoundException(`user not found exception. email: ${email}`);
    }

    const [slat, storedHash] = user.password.split('.');

    const hash = (await this._scrypt(password, slat, 32)) as Buffer;

    if (storedHash !== hash.toString('hex')) {
      throw new BadRequestException(`Wrong password. email: ${email}`);
    }

    return user;
  }
}
