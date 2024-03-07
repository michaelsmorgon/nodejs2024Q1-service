import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  HttpCode,
  UseInterceptors,
  ClassSerializerInterceptor,
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
    return this.userService.create(createUserDto);
  }

  @Get()
  findAll(): User[] {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', IdValidationPipe) id: string): User {
    return this.userService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id', IdValidationPipe) id: string,
    @Body() updatePassDto: UpdatePasswordDto,
  ): User {
    return this.userService.update(id, updatePassDto);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id', IdValidationPipe) id: string): void {
    return this.userService.remove(id);
  }
}
