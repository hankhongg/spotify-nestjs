import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {ConfigModule, ConfigService} from '@nestjs/config';
import { DataSource } from 'typeorm';
import { config } from 'process';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule.forRoot()], // load config module
      inject: [ConfigService], // use config service
      useFactory: async (configService: ConfigService) => {
        return {
          type: 'mongodb',
          url: configService.get<string>('DATABASE_URL'),
          port: configService.get<number>('DATABASE_PORT'),
          username: configService.get<string>('DATABASE_USER'),
          password: configService.get<string>('DATABASE_PASSWORD'),
          database: configService.get<string>('DATABASE_NAME'),
          entities: [],
          synchronize: true,
          autoLoadEntities: true,
        };
      }
    })
  ],
  exports: [TypeOrmModule]
})
export class DatabaseModule implements OnModuleInit {
  constructor(private readonly dataSource: DataSource) {}

  async onModuleInit() {
    if (this.dataSource.isInitialized) { // check if db is connected
      console.log('Database connection is already established.');
    } else {
      console.error('Database connection is NOT established.');
    }
  }
}
