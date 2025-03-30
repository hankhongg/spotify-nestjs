import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import * as bcrypt from 'bcryptjs'; // Import bcrypt for password hashing and comparison
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ArtistsService } from 'src/artists/artists.service';
import { PayLoadType } from './payload.type';

// This service will handle authentication logic, such as validating users and generating JWT tokens.
@Injectable()
export class AuthService {
    constructor(private usersService: UsersService, private jwtService: JwtService, private artistsService : ArtistsService) {} // inject the users service
    async login(loginDto: LoginDto) : Promise<{accessToken: string}> { // tạm thời trả về một user
        // remember to install nestjs/jwt and @nestjs/passport
        // and import JwtModule in the auth module
        const user = await this.usersService.findOne(loginDto); // Find the user by email
        if (!user) {
            throw new UnauthorizedException('User not found'); // If user is not found, throw an error
        }
        const isPasswordValid = await bcrypt.compare(loginDto.password, user.password); // Compare the password with the hashed password
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid password'); // If password is invalid, throw an error
        }
        else {
            user.password = ""; // Remove the password from the user object before returning it
            const payload : PayLoadType = { email: user.email, userId: user.id }; // Create a payload for the JWT token
            const artist = await this.artistsService.findOne(user.id); // Find the artist by user id
            if (artist){
                payload.artistId = artist.id; // If artist is found, add the artist id to the payload
            }
            return{
                accessToken: this.jwtService.sign(payload), // Sign the payload to create a JWT token
            }
        }
         // Return the found user
    }
}
