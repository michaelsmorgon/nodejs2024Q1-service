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
  ParseUUIDPipe,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { EntityName, getNotFoundMsg } from 'src/utils/errors';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.userService.create(createUserDto);
    return {
      ...user,
      createdAt: (user.createdAt as Date).getTime(),
      updatedAt: (user.updatedAt as Date).getTime(),
    };
  }

  @Get()
  async findAll() {
    return await this.userService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    const result = await this.userService.findOne(id);
    if (!result) {
      throw new NotFoundException(getNotFoundMsg(EntityName.USER));
    }
    return result;
  }

  @Put(':id')
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updatePassDto: UpdatePasswordDto,
  ) {
    const result = await this.userService.update(id, updatePassDto);

    return {
      ...result,
      createdAt: (result.createdAt as Date).getTime(),
      updatedAt: (result.updatedAt as Date).getTime(),
    };
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.userService.remove(id);
  }
}
