import { faker } from "@faker-js/faker";
import * as bcrypt from "bcryptjs";
import { Artist } from "src/artists/entities/artist.entity";
import { Playlist } from "src/playlists/entities/playlist.entity";
import { User } from "src/users/entities/user.entity";
import { EntityManager } from "typeorm";
import { v4 as uuid4 } from "uuid";

export const seedData = async (manager: EntityManager) => {
    await seedUser();
    await seedArtist();
    await seedPlaylist();

    async function seedUser() : Promise<User> {
        const salt = await bcrypt.genSalt();
        const password = await bcrypt.hash("password", salt);
        
        const user = new User();
        user.firstName = faker.person.firstName();
        user.lastName = faker.person.lastName();
        user.email = faker.internet.email();
        user.password = password;
        user.apiKey = uuid4();

        return await manager.getRepository(User).save(user);
    }

    async function seedArtist() {
        const user = await seedUser();
        const artist = new Artist();
        artist.user = user;
        artist.artistName = faker.person.fullName();
        
        await manager.getRepository(Artist).save(artist);
    }

    async function seedPlaylist() {
        const user = await seedUser();
        const playlist = new Playlist();
        playlist.user = user;
        playlist.name = faker.music.songName();
        
        await manager.getRepository(Playlist).save(playlist);
    }
}