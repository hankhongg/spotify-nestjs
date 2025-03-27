import { Optional } from "@nestjs/common";
import { Column, Entity, ObjectIdColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity('songs')
export class Song{
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    title: string;
    @Column('varchar', {array: true})
    artists: string[];
    @Column()
    album: string;
    @Column('date')
    releasedYear: Date;
    @Column('time')
    duration: Date;
    @Column('text')
    @Optional()
    lyrics: string;
}