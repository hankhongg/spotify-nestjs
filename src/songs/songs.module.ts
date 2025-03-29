import { Module } from '@nestjs/common';
import { SongsController } from './songs.controller';
import { SongsService } from './songs.service';
import { connection } from 'src/common/constants/connection';
import { Type } from 'class-transformer';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Song } from './song.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Song])], // import the song entity aka the repository
  // this will create a repository for the song entity => then inject it into the service
  controllers: [SongsController],
  providers: [SongsService,
    {
      provide: 'CONNECTION',
      useValue: connection, // declare this to use inside the song service
    }
  ]
})
export class SongsModule {}
