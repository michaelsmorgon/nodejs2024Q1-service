import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { Public } from './decorators/public.decorator';
import { Token } from './interface/token';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.CREATED)
  @Post('signup')
  signUp(@Body() createUserDto: CreateUserDto) {
    return this.authService.signUp(createUserDto.login, createUserDto.password);
  }

  @Public()
  @Post('login')
  login(@Body() createUserDto: CreateUserDto) {
    return this.authService.login(createUserDto.login, createUserDto.password);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  refresh(@Body() token: Token) {
    return this.authService.refresh(token.refreshToken);
  }
}
