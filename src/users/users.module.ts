import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])], // import the user entity aka the repository
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService], // export the service so it can be used in other modules
})
export class UsersModule {}
