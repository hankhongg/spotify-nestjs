import { IsNotEmpty, IsOptional } from "class-validator";
import { Column, PrimaryGeneratedColumn } from "typeorm";

export class CreateUserDto {
    @IsNotEmpty()
    @Column()
    readonly firstName: string;
    @IsNotEmpty()
    @Column()
    
    readonly lastName: string;
    @IsNotEmpty()
    @Column()
    readonly email: string;
    @IsNotEmpty()
    @Column()
    password: string;

    @Column()
    @IsOptional()
    readonly apiKey?: string; // this is the api key for the user
}
