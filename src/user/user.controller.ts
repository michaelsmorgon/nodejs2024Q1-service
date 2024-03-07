import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpCode,
  UseInterceptors,
  ClassSerializerInterceptor,
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { IdValidationPipe } from 'src/pipes/id-validation-pipe';
import { User } from './entities/user.entity';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return new User(this.userService.create(createUserDto));
  }

  @Get()
  findAll(): User[] {
    const users = this.userService.findAll();
    return users.map((user) => new User(user));
  }

  @Get(':id')
  findOne(@Param('id', IdValidationPipe) id: string): User {
    return new User(this.userService.findOne(id));
  }

  @Put(':id')
  update(
    @Param('id', IdValidationPipe) id: string,
    @Body() updatePassDto: UpdatePasswordDto,
  ): User {
    return new User(this.userService.update(id, updatePassDto));
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id', IdValidationPipe) id: string): void {
    return this.userService.remove(id);
  }
}
