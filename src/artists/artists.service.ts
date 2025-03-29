import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Artist } from './entities/artist.entity';
import { User } from 'src/users/entities/user.entity';
import { ExceptionsHandler } from '@nestjs/core/exceptions/exceptions-handler';

@Injectable()
export class ArtistsService {
  @InjectRepository(Artist)
  private readonly artistRepository: Repository<Artist>;
  @InjectRepository(User)
  private readonly userRepository: Repository<User>;

  async create(createArtistDto: CreateArtistDto) : Promise<Artist> {
    // search for user by id first
    // if user not found, return null
    // if user found, create a new artist and save it to the database
    const user = await this.userRepository.findOneBy({ id: createArtistDto.userId }); // find the user by id
    if (!user) {
      throw new NotFoundException(`User with id ${createArtistDto.userId} not found`); // if user not found, throw an exception
    }
    const artist = new Artist(); // create a new artist object
    artist.user = user; // set the user to the artist
    return await this.artistRepository.save(artist); // save the artist to the database
  }

  async findAll() : Promise<Artist[]> { // return a promise of the array of artists
    return await this.artistRepository.find({relations: ["user"]}); // Include user data
    // find all artists in the database and return them with the user relation
  }

  findOne(id: number) {
    return `This action returns a #${id} artist`;
  }

  update(id: number, updateArtistDto: UpdateArtistDto) {
    return `This action updates a #${id} artist`;
  }

  remove(id: number) {
    return `This action removes a #${id} artist`;
  }
}
