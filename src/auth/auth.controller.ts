import { Body, Controller, Post } from '@nestjs/common';
import { create } from 'domain';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

@Controller('auth')
export class AuthController {
    constructor(private usersService: UsersService) {} // inject the users service
    @Post('signup')
    signup(@Body() createUserDTO: CreateUserDto) : Promise<User>{
        return this.usersService.create(createUserDTO); // create a new user and return it
    }
}
