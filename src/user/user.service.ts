import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { DBService } from 'src/db/db.service';
import {
  EntityName,
  getNotFoundMsg,
  getOldPassWrongMsg,
} from 'src/utils/errors';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  private select = {
    id: true,
    login: true,
    version: true,
    createdAt: true,
    updatedAt: true,
  };
  constructor(private readonly dbService: DBService) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const creationTime = this.getTimestamp();
    const result = await this.dbService.user.create({
      data: {
        ...createUserDto,
        createdAt: creationTime,
        updatedAt: creationTime,
      },
      select: this.select,
    });
    return result;
  }

  async findAll(): Promise<User[]> {
    const result = await this.dbService.user.findMany({
      select: this.select,
    });
    return result;
  }

  async findOne(id: string): Promise<User> {
    const result = await this.dbService.user.findUnique({
      where: { id },
      select: this.select,
    });
    return result;
  }

  async findByLogin(login: string): Promise<User> {
    const result = await this.dbService.user.findFirst({
      where: { login },
    });
    return result;
  }

  async update(id: string, updatePassDto: UpdatePasswordDto): Promise<User> {
    let result = await this.findOne(id);
    if (!result) {
      throw new NotFoundException(getNotFoundMsg(EntityName.USER));
    }
    try {
      result = await this.dbService.user.update({
        where: {
          id,
          password: updatePassDto.oldPassword,
        },
        data: {
          version: { increment: 1 },
          password: updatePassDto.newPassword,
          updatedAt: this.getTimestamp(),
        },
        select: this.select,
      });
      return result;
    } catch {
      throw new ForbiddenException(getOldPassWrongMsg());
    }
  }

  async remove(id: string): Promise<void> {
    const result = await this.findOne(id);
    if (!result) {
      throw new NotFoundException(getNotFoundMsg(EntityName.USER));
    }
    await this.dbService.user.delete({
      where: { id },
    });
  }

  private getTimestamp(): string {
    return new Date().toISOString();
  }
}
