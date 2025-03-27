import { Inject, Injectable } from '@nestjs/common';
import { DevConfigService } from './common/providers/DevConfigService';

@Injectable()
export class AppService {
  // put in the constructor Inject('CONFIG') to use from what imported into module
  constructor(private devConfigService: DevConfigService, @Inject('CONFIG') private config: {port: string}) { }

  getHello(): string {
    return `Hello World! ${this.devConfigService.DBHOST}: ${this.config.port}`;
  }
}
