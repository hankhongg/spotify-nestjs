import { Body, Controller, HttpException, Post, UnauthorizedException } from '@nestjs/common';
import { create } from 'domain';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private usersService: UsersService, private authService: AuthService) {} // inject the users service
    @Post('signup')
    signup(@Body() createUserDTO: CreateUserDto) : Promise<User>{
        return this.usersService.create(createUserDTO); // create a new user and return it
    }
    @Post('login')
    async login(@Body() loginDto: LoginDto) {
        const user = this.authService.login(loginDto); // login the user and return the user
        if(!user) return new UnauthorizedException('User not found'); // if user not found, throw an error
        return user; // return the user
    }
}
