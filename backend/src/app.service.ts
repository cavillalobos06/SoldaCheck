import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello() {
    return {
      status: 'ok',
      service: 'Pixel Perfect Canvas Backend API',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
    };
  }
}
