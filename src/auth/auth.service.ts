import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import {
  EntityName,
  getInvalidTokenMsg,
  getNoUserMsg,
  getNotFoundMsg,
  getTokenReqMsg,
} from 'src/utils/errors';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signUp(login: string, password: string) {
    const hashPassword = await bcrypt.hash(password, 10);
    return await this.userService.create({
      login,
      password: hashPassword,
    });
  }

  async login(login: string, password: string) {
    const user = await this.userService.findByLogin(login);
    if (!user) {
      throw new NotFoundException(getNotFoundMsg(EntityName.USER));
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new ForbiddenException(getNoUserMsg());
    }

    const payload = {
      userId: user.id,
      login: user.login,
    };
    return {
      accessToken: await this.jwtService.signAsync(payload),
      refreshToken: await this.jwtService.signAsync(payload, {
        secret: process.env.JWT_SECRET_REFRESH_KEY,
        expiresIn: process.env.TOKEN_REFRESH_EXPIRE_TIME,
      }),
    };
  }

  async refresh(refreshToken: string) {
    if (!refreshToken) {
      throw new UnauthorizedException(getTokenReqMsg());
    }
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: process.env.JWT_SECRET_REFRESH_KEY,
      });

      const user = await this.userService.findOne(payload.userId);
      if (!user) {
        throw new ForbiddenException(getInvalidTokenMsg());
      }

      const newPayload = {
        userId: user.id,
        login: user.login,
      };
      return {
        accessToken: await this.jwtService.signAsync(newPayload),
        refreshToken: await this.jwtService.signAsync(newPayload, {
          secret: process.env.JWT_SECRET_REFRESH_KEY,
          expiresIn: process.env.TOKEN_REFRESH_EXPIRE_TIME,
        }),
      };
    } catch {
      throw new ForbiddenException(getInvalidTokenMsg());
    }
  }
}
