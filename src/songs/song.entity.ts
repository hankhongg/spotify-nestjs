import { Optional } from "@nestjs/common";
import { Column, Entity, ObjectIdColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity('songs')
export class Song{
    @PrimaryGeneratedColumn() // auto increment id so it is not required to be passed in the request body
    id: number;
    @Column()
    title: string;
    @Column('varchar', {array: true})
    artists: string[];
    @Column()
    album: string;
    @Column('date')
    releasedDate: string;
    @Column('time')
    duration: string;
    @Column('text', {nullable: true})
    // @Optional() //@Optional() là decorator của NestJS, nhưng bạn đang dùng trong Entity của TypeORM, điều này không hợp lệ. 
    lyrics?: string;
}