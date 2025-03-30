import { Module, MiddlewareConsumer, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SongsModule } from './songs/songs.module';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { SongsController } from './songs/songs.controller';
import { DevConfigService } from './common/providers/DevConfigService';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { ArtistsModule } from './artists/artists.module';
import { AuthModule } from './auth/auth.module';
import { PlaylistsModule } from './playlists/playlists.module';

const devConfig = {port: '400'}
const prodConfig = {port: '500'}

@Module({
  imports: [SongsModule, ConfigModule.forRoot(
    {isGlobal: true} // make the config module global
  ), DatabaseModule, UsersModule, ArtistsModule, AuthModule, PlaylistsModule],
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
    }
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    // consumer
    //   .apply(LoggerMiddleware)
    //   .forRoutes("songs"); // opt 1
    
    // consumer.apply(LoggerMiddleware).forRoutes({path: "songs", method: RequestMethod.POST}); // opt 2

    consumer.apply(LoggerMiddleware).forRoutes(SongsController); // opt 3
  }
  
}
