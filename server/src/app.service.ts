import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Assets Tracker Backend Server is Running!';
  }
}
