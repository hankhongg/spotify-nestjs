import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from 'src/users/entities/user.entity';
import { UsersModule } from 'src/users/users.module';
import {JwtModule} from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt-strategy';
import { PassportModule } from '@nestjs/passport';
import { ArtistsModule } from 'src/artists/artists.module';
import { ApiKeyStrategy } from './api-key-strategy';

@Module({
  imports: [UsersModule, JwtModule.registerAsync({ //wait for the config service to be ready
    imports: [ConfigModule], // import the config module
    inject: [ConfigService],
    useFactory: async (configService: ConfigService) => ({
      secret: configService.get('JWT_SECRET'), // get the secret from the config service
      signOptions: { expiresIn: '1h' }, // set the expiration time for the token
    })
  }), PassportModule, ArtistsModule], // import the passport module bc providers: [JwtStrategy] needs it
  providers: [AuthService, JwtStrategy, ApiKeyStrategy], // register the jwt strategy cuz we gonna use it in the auth controller
  controllers: [AuthController],
  exports: [AuthService], // export the AuthService so it can be used in other modules
})
export class AuthModule {}
