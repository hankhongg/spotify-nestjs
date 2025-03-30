import { Module } from '@nestjs/common';
import { ArtistsService } from './artists.service';
import { ArtistsController } from './artists.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Artist } from './entities/artist.entity';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Artist, User])], // import the artist entity aka the repository
  controllers: [ArtistsController],
  providers: [ArtistsService],
  exports: [ArtistsService], // export the ArtistsService so it can be used in other modules
})
export class ArtistsModule {}
