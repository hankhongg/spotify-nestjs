import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import * as bcrypt from 'bcryptjs'; // Import bcrypt for password hashing and comparison
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ArtistsService } from 'src/artists/artists.service';
import { Enable2FAType, PayLoadType } from './dto/payload.type';
import * as speakeasy from 'speakeasy'; // Import speakeasy for 2FA
import { ConfigService } from '@nestjs/config';

// This service will handle authentication logic, such as validating users and generating JWT tokens.
@Injectable()
export class AuthService {
    constructor(private usersService: UsersService, private configService: ConfigService  ,private jwtService: JwtService, private artistsService : ArtistsService) {} // inject the users service
    
    async login(loginDto: LoginDto) : Promise<{accessToken: string, refreshToken: string} | {validate2fa: string, message: string}> { // tạm thời trả về một user
        // remember to install nestjs/jwt and @nestjs/passport
        // and import JwtModule in the auth module

        // can either return a accessToken OR a link to validate the 2fa token 

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

            if(user?.isTwoFAEnabled && user?.twoFASecret){
                return {
                    validate2fa: 'http://localhost:3000/auth/validate2fa', // Return a link to validate the 2FA token
                    message: 'Please validate your 2FA token', // Return a message to the user
                }
            }

            const artist = await this.artistsService.findOne(user.id); // Find the artist by user id
            if (artist){
                payload.artistId = artist.id; // If artist is found, add the artist id to the payload
            }
            return{
                accessToken: this.jwtService.sign(payload, {expiresIn: '60s'}), // Sign the payload to create a JWT token
                refreshToken: this.jwtService.sign(payload, { secret:this.configService.get<string>('REFRESH_JWT_SECRET') ,expiresIn: '1h' }), // Sign the payload to create a refresh token with an expiration time of 7 days
            }
        }
         // Return the found user
    }

    async enable2FA(userId: number) : Promise<Enable2FAType>{
        const user = await this.usersService.findOneById(userId); // Find the user by id
        if (!user) {
            throw new UnauthorizedException('User not found'); // If user is not found, throw an error
        }
        const secret = speakeasy.generateSecret(); // Generate a secret for 2FA
        console.log(secret); // Log the secret for debugging purposes
        await this.usersService.f2aUpdate(userId, secret.base32); // Update the user object in the database
        return { secret: secret.base32 }; // Return the secret
    }

    async disable2FA(userId: number) : Promise<UpdateResult> {
        const user = await this.usersService.findOneById(userId); // Find the user by id
        if (!user) {
            throw new UnauthorizedException('User not found'); // If user is not found, throw an error
        }
        return await this.usersService.f2aDisable(userId); // Update the user object in the database to disable 2FA
    }

    async validate2fa(userId: number, validateTokenDto: { token: string }) : Promise<{ verified: boolean }> {
        try {
            const user = await this.usersService.findOneById(userId); // Find the user by id
            if (!user) {
                throw new UnauthorizedException('User not found'); // If user is not found, throw an error
            }
            const verified = speakeasy.totp.verify({ 
                secret: user.twoFASecret, // Use the user's 2FA secret
                encoding: 'base32', // Use base32 encoding for the secret
                token: validateTokenDto.token, // Use the token from the request body
            }); // check xem token có hợp lệ không
            if (!verified) {
                return { verified: false }; // If token is invalid, return false
            } else return { verified: true }; // If token is valid, return true

        } catch (error) {
            throw new UnauthorizedException('User not found'); // If user is not found, throw an error
        }
    }

    async validateApiKey(apiKey: string) : Promise<User | null> {
        return await this.usersService.findByApiKey(apiKey); // Find the user by api key
    }

    async refreshToken(user: User): Promise<{ accessToken: string}> {
        const payload: PayLoadType = { email: user.email, userId: user.id }; // Create a payload for the JWT token
        const artist = await this.artistsService.findOne(user.id); // Find the artist by user id
        if (artist){
            payload.artistId = artist.id; // If artist is found, add the artist id to the payload
        }
        return {
            accessToken: this.jwtService.sign(payload, {expiresIn: '60s'}), // Sign the payload to create a JWT token
        }
    }

    async signRefreshToken(payload: PayLoadType) : Promise<string> {
        return this.jwtService.sign(payload, {expiresIn: '1d', secret: this.configService.get<string>('REFRESH_JWT_SECRET')}); // Sign the payload to create a refresh token with an expiration time of 7 days
    }

    async signAccessToken(payload: PayLoadType) : Promise<string> {
        return this.jwtService.sign(payload, {expiresIn: '60s'}); // Sign the payload to create a JWT token
    }
}
