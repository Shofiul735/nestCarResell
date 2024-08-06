import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/users/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../dtos/users/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly repo: Repository<User>,
  ) {}

  async createUser(user: CreateUserDto): Promise<User> {
    const createdUser = this.repo.create(user);
    return await this.repo.save(createdUser);
  }

  async findUser(id: number): Promise<User> {
    return await this.repo.findOne({
      where: {
        id: id,
      },
    });
  }

  async updateUser(id: number, attrs: Partial<User>): Promise<Boolean> {
    const update = await this.repo.update(id, attrs);
    if (update?.affected) {
      return true;
    }
    return false;
  }

  async removeUser(id: number): Promise<boolean> {
    const user = await this.repo.findOne({
      where: {
        id: id,
      },
    });
    if (!user) return false;
    await this.repo.remove(user);
    return true;
  }
  async findByEmail(email: string) {
    return this.repo.find({
      where: {
        email,
      },
    });
  }
}
