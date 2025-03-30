import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import * as bcrypt from 'bcryptjs'; // Import bcrypt for password hashing and comparison
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
    // This service will handle authentication logic, such as validating users and generating JWT tokens.
    // For now, we can leave it empty or add some basic functionality.
    constructor(private usersService: UsersService) {} // inject the users service
    async login(loginDto: LoginDto): Promise<User> { // tạm thời trả về một user
        // Implement your login logic here
        const user = await this.usersService.findOne(loginDto); // Find the user by email
        if (!user) {
            throw new UnauthorizedException('User not found'); // If user is not found, throw an error
        }
        const isPasswordValid = await bcrypt.compare(loginDto.password, user.password); // Compare the password with the hashed password
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid password'); // If password is invalid, throw an error
        }
        return user; // Return the found user
    }
}
