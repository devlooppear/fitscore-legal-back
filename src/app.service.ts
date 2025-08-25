import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): Object {
    return { message: 'Welcome to FitScore Legal API!' };
  }
}
