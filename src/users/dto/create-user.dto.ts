import { IsOptional } from "class-validator";
import { Column, PrimaryGeneratedColumn } from "typeorm";

export class CreateUserDto {
    @IsOptional()
    @Column()
    firstName: string;
    @IsOptional()
    @Column()
    
    lastName: string;
    @IsOptional()
    @Column()
    email: string;
    @IsOptional()
    @Column()
    password: string;
}
