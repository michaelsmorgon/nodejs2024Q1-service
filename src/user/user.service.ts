import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { IUser } from './interfaces/user.interface';
import { v4 } from 'uuid';
import { ErrorMessages } from 'src/utils/errors';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  private users: IUser[] = [];

  create(createUserDto: CreateUserDto): User {
    const id = v4();
    const creationTime = this.getTimestamp();
    const version = 1;
    const user: IUser = {
      id,
      login: createUserDto.login,
      password: createUserDto.password,
      version,
      createdAt: creationTime,
      updatedAt: creationTime,
    };
    this.users.push(user);
    return user;
  }

  findAll(): IUser[] {
    return [...this.users];
  }

  findOne(id: string): IUser {
    return this.getUserById(id);
  }

  update(id: string, updatePassDto: UpdatePasswordDto): IUser {
    const index = this.getUserIndexById(id);
    const oldUser = this.getUserById(id);
    if (oldUser.password !== updatePassDto.oldPassword) {
      throw new ForbiddenException(ErrorMessages.INVALID_DATA);
    }
    const newUser: IUser = {
      ...oldUser,
      password: updatePassDto.newPassword,
      version: oldUser.version + 1,
      updatedAt: this.getTimestamp(),
    };
    this.users.splice(index, 1, newUser);
    const response = { ...newUser };
    delete response.password;
    return response;
  }

  remove(id: string): void {
    const index = this.getUserIndexById(id);
    this.users.splice(index, 1);
  }

  private getUserById(id: string): IUser {
    const index = this.getUserIndexById(id);
    return this.users[index];
  }

  private getUserIndexById(id: string): number {
    const index = this.users.findIndex((user) => user.id === id);
    if (index === -1) {
      throw new NotFoundException(ErrorMessages.NOT_FOUND);
    }
    return index;
  }

  private getTimestamp(): number {
    return Date.now();
  }
}
