import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { ErrorMessages } from 'src/utils/errors';
import { User } from './entities/user.entity';
import { generateId } from 'src/utils/id-generator';

@Injectable()
export class UserService {
  private users: User[] = [];

  create(createUserDto: CreateUserDto): User {
    const id = generateId();
    const creationTime = this.getTimestamp();
    const version = 1;
    const user = new User({
      id,
      login: createUserDto.login,
      password: createUserDto.password,
      version,
      createdAt: creationTime,
      updatedAt: creationTime,
    });
    this.users.push(user);
    return user;
  }

  findAll(): User[] {
    return [...this.users];
  }

  findOne(id: string): User {
    return this.getUserById(id);
  }

  update(id: string, updatePassDto: UpdatePasswordDto): User {
    const index = this.getUserIndexById(id);
    const oldUser = this.getUserById(id);
    if (oldUser.password !== updatePassDto.oldPassword) {
      throw new ForbiddenException(ErrorMessages.INVALID_DATA);
    }
    const newUser = new User({
      ...oldUser,
      password: updatePassDto.newPassword,
      version: oldUser.version + 1,
      updatedAt: this.getTimestamp(),
    });
    this.users.splice(index, 1, newUser);
    return newUser;
  }

  remove(id: string): void {
    const index = this.getUserIndexById(id);
    this.users.splice(index, 1);
  }

  private getUserById(id: string): User {
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
