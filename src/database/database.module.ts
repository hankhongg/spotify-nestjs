import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {ConfigModule, ConfigService} from '@nestjs/config';
import { DataSource } from 'typeorm';
import { Song } from 'src/songs/song.entity';
import { Artist } from 'src/artists/entities/artist.entity';
import { User } from 'src/users/entities/user.entity';
import { Playlist } from 'src/playlists/entities/playlist.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule.forRoot()], // load config module
      inject: [ConfigService], // use config service
      useFactory: async (configService: ConfigService) => {
        return {
          type: 'postgres',
          host: configService.get('DATABASE_HOST'),
          port: configService.get('DATABASE_PORT'),
          username: configService.get('DATABASE_USERNAME'),
          password: configService.get('DATABASE_PASSWORD'),
          database: configService.get('DATABASE_NAME'),
          entities: [Song, Artist, User, Playlist],
          synchronize: false, // good for production
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
