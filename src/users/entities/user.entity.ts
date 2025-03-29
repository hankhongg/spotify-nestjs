import { Exclude } from "class-transformer";
import { Playlist } from "src/playlists/entities/playlist.entity";
import { Column, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('users') // this is the name of the table in the database
export class User {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    firstName: string;
    @Column()
    lastName: string;
    @Column({unique: true}) // make the email unique
    email: string;
    @Column()
    @Exclude()    // exclude the password from the response
    password: string;

    @OneToMany(() => Playlist, (playlist) => playlist.user, { cascade: true })
    playlists: Playlist[]; // this is the relationship with the playlist entity
}
