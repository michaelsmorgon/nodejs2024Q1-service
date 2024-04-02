import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return `Welcome to the Home Library Service! Go to the http://localhost/${
      parseInt(process.env.PORT, 10) || 4000
    }/doc`;
  }
}
