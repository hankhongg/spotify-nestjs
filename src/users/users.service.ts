import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcryptjs'; // import bcrypt for password hashing
import { LoginDto } from 'src/auth/dto/login.dto';

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
  // for auth only
  async findOne(data: LoginDto) : Promise<User | null> { // return a promise of the user
    const user = await this.userRepository.findOneBy({email: data.email}); // find the user by id
    if(!user) throw new UnauthorizedException("User not found"); // if not found, throw an error
    return user;
  }

  async findOneById(id: number) : Promise<User> {
    const user = await this.userRepository.findOneBy({id}); // find the user by id
    if(!user) throw new UnauthorizedException("User not found"); // if not found, throw an error
    return user;
  }

  f2aUpdate(id: number, secret: string) : Promise<UpdateResult> {
    const user = this.userRepository.findOneBy({id}); // find the user by id
    if(!user) throw new UnauthorizedException("User not found"); // if not found, throw an error
    return this.userRepository.update(id, {twoFASecret: secret, isTwoFAEnabled: true}); // update the user object in the database
  }

  f2aDisable(id: number) : Promise<UpdateResult> {
    const user = this.userRepository.findOneBy({id}); // find the user by id
    if(!user) throw new UnauthorizedException("User not found"); // if not found, throw an error
    return this.userRepository.update(id, {twoFASecret: "", isTwoFAEnabled: false}); // update the user object in the database
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
