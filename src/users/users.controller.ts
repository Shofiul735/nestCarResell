import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateUser } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserDto } from 'src/dtos/users/users.dto';
import { Serialize } from 'src/core/interceptors/serialize.interceptor';

@Serialize(UserDto)
@Controller('auth')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post('/signup')
  async createUser(@Body() body: CreateUser) {
    await this.userService.createUser(body);
  }
  @Get('/:id')
  async findUser(@Param('id') id: string) {
    return await this.userService.findUser(parseInt(id));
  }

  @Patch('/:id')
  async updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return await this.userService.updateUser(parseInt(id), body);
  }
}
