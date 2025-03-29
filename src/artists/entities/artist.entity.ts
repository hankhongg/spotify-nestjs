import { IsNotEmpty, IsString } from "class-validator";
import { Song } from "src/songs/song.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('artists') // this is the name of the table in the database
export class Artist {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @IsString()
    @IsNotEmpty()
    artistName: string; // the name of the artist

    @OneToOne(() => User)
    @JoinColumn() // this will create a foreign key in the artist table
    user: User; // this is the foreign key to the user table

    @ManyToMany(() => Song, (song) => song.artists) // this will create a many to many relationship between artist and song
    songs: Song[]; // this is the foreign key to the song table
}

// ✅ @OneToOne → Defines the one-to-one relationship.
// ✅ @JoinColumn() → Specifies where the foreign key is stored.
// ❌ Without @JoinColumn(), TypeORM won't know which table owns the foreign key

// also remember to register the entities in the module