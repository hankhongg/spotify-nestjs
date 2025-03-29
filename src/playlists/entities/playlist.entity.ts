import { Song } from "src/songs/song.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('playlists') // this is the name of the table in the database
export class Playlist {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    name: string;

    // 1 playlist can have many songs
    // 1 song can belong to many playlists
    @OneToMany(() => Song, (song) => song.playlist, { cascade: true })
    songs: Song[]; // this is the relationship with the song entity

    // many playlists belong to one user
    @ManyToOne(() => User, (user) => user.playlists)
    @JoinColumn() // this is the foreign key to the user table
    user: User;
}
