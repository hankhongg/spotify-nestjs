import { Optional } from "@nestjs/common";
import { IsOptional } from "class-validator";
import { Artist } from "src/artists/entities/artist.entity";
import { Playlist } from "src/playlists/entities/playlist.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, ObjectIdColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity('songs')
export class Song{
    @PrimaryGeneratedColumn() // auto increment id so it is not required to be passed in the request body
    id: number;
    @Column()
    title: string;
    // @Column('varchar', {array: true})
    // artists: string[];
    @Column()
    album: string;
    @Column('date')
    releasedDate: string;
    @Column('time')
    duration: string;
    @Column('text', {nullable: true})
    // @Optional() //@Optional() là decorator của NestJS, nhưng bạn đang dùng trong Entity của TypeORM, điều này không hợp lệ. 
    lyrics?: string;

    @ManyToMany(() => Artist, (artist) => artist.songs, {cascade: true}) // many to many relationship with artist entity
    @JoinTable({name: "songs_artists"}) // this will create a join table to store the relationship
    artists: Artist[]; // this is the foreign key to the artist table

    @ManyToOne(() => Playlist, (playlist) => playlist.songs) // many to one relationship with playlist entity
    @JoinColumn()
    playlist: Playlist; // this is the foreign key to the playlist table
}