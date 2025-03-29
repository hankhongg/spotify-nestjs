import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcryptjs'; // import bcrypt for password hashing

@Injectable()
export class UsersService {
  @InjectRepository(User)
  private readonly userRepository: Repository<User>; // inject the user repository

  // create(createUserDto: CreateUserDto) : Promise<User> {
  //   const user = new User();
  //   user.firstName = createUserDto.firstName;
  //   user.lastName = createUserDto.lastName;
  //   user.email = createUserDto.email;
  //   user.password = createUserDto.password;
  //   return this.userRepository.save(user); // save the user to the database
  // }

  async create(createUserDto: CreateUserDto) : Promise<User> {
    const salt = await bcrypt.genSalt(); // generate a salt
    createUserDto.password = await bcrypt.hash(createUserDto.password, salt); // hash the password with the salt
    const user = await this.userRepository.save(createUserDto); // create a new user object
    user.password = ""; // remove the password from the user object
    return user;
  }
  async findAll() : Promise<User[]> { // return a promise of the array of users
    return await this.userRepository.find(); // find all users in the database
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
