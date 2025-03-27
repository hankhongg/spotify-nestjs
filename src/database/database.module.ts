import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {ConfigModule, ConfigService} from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule], // load config module
      inject: [ConfigService], // use config service
      useFactory: /*async*/ (configService: ConfigService) => ({ // if use supabase consider using async function
        type: 'mongodb',
        url: configService.get<string>('DATABASE_URL'),
        port: configService.get<number>('DATABASE_PORT'),
        username: configService.get<string>('DATABASE_USERNAME'),
        password: configService.get<string>('DATABASE_PASSWORD'),
        database: configService.get<string>('DATABASE_NAME'),
        synchronize: true,
        autoLoadEntities: true,
      })
    })
  ]
})
export class DatabaseModule {}
