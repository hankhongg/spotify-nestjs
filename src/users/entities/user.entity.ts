import { ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import { Playlist } from "src/playlists/entities/playlist.entity";
import { Column, Entity, Exclusion, JoinColumn, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('users') // this is the name of the table in the database
export class User {
    @PrimaryGeneratedColumn()
    id: number;
    
    @ApiProperty({example: 'John', description: 'The first name of the user'})
    @Column()
    firstName: string;
    
    @ApiProperty({example: 'Doe', description: 'The last name of the user'})
    @Column()
    lastName: string;
    
    @ApiProperty({example: 'hankhongg@gmail.com', description: 'The email of the user'})
    @Column({unique: true}) // make the email unique
    email: string;
    
    @ApiProperty({example: 'password', description: 'The password of the user'})
    @Column()
    @Exclude()    // exclude the password from the response
    password: string;

    @OneToMany(() => Playlist, (playlist) => playlist.user, { cascade: true })
    playlists: Playlist[]; // this is the relationship with the playlist entity

    
    @Column({nullable: true, type: 'text'})
    twoFASecret: string; // this is the two factor authentication secret
    
    @Column({default: false, type: 'boolean'})
    isTwoFAEnabled: boolean; // this is the two factor authentication enabled flag

    
    @Column({nullable: true})
    apiKey: string;
}
