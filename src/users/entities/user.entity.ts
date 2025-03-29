import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('users') // this is the name of the table in the database
export class User {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    firstName: string;
    @Column()
    lastName: string;
    @Column()
    email: string;
    @Column()
    password: string;
}
