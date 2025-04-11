import { Module, MiddlewareConsumer, NestModule, RequestMethod, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SongsModule } from './songs/songs.module';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { SongsController } from './songs/songs.controller';
import { DevConfigService } from './common/providers/DevConfigService';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { ArtistsModule } from './artists/artists.module';
import { AuthModule } from './auth/auth.module';
import { PlaylistsModule } from './playlists/playlists.module';
import { SeedModule } from './seed/seed.module';
import { SeedService } from './seed/seed.service';
import configuration from './config/configuration';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmModuleAsyncOptions } from 'db/data-source';
import { DataSource } from 'typeorm';
import * as joi from 'joi';
import { ExternalApisModule } from 'external-apis/external-apis.module';

const devConfig = {port: '400'}
const prodConfig = {port: '500'}

@Module({
  imports: [SongsModule, ConfigModule.forRoot(
    {
      isGlobal: true,
      envFilePath: ['.env'],
      load: [configuration],
      validationSchema: joi.object({
        DATABASE_HOST: joi.string().required(),
        DATABASE_PORT: joi.number().default(5432),
        DATABASE_USERNAME: joi.string().required(),
        DATABASE_PASSWORD: joi.string().required(),
        DATABASE_NAME: joi.string().required(),
        JWT_SECRET: joi.string().required(),
      })
    } // make the config module global
  ), 
  UsersModule, 
  ArtistsModule, 
  AuthModule, 
  PlaylistsModule, 
  SeedModule,
  TypeOrmModule.forRootAsync(typeOrmModuleAsyncOptions),
  ExternalApisModule
],
  controllers: [AppController],
  providers: [AppService,
    {
      provide: 'CONFIG',
      useFactory: () => {
        return process.env.NODE_ENV === 'development' ? devConfig : prodConfig;
      }
    },
    {
      provide: DevConfigService,
      useClass: DevConfigService, // use Class
    },
    SeedService],
})
export class AppModule implements OnModuleInit {
  constructor(private readonly dataSource: DataSource) {} // inject the data source

  configure(consumer: MiddlewareConsumer) {
    // consumer
    //   .apply(LoggerMiddleware)
    //   .forRoutes("songs"); // opt 1
    
    // consumer.apply(LoggerMiddleware).forRoutes({path: "songs", method: RequestMethod.POST}); // opt 2

    consumer.apply(LoggerMiddleware).forRoutes(SongsController); // opt 3
  }


  async onModuleInit() {
    if(this.dataSource.isInitialized) { // check if db is connected
      console.log('Database connection is already established haha.');
    } else {
      console.error('Database connection is NOT established.');
    }
  }
  
}
