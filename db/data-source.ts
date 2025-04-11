import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModuleAsyncOptions } from "@nestjs/typeorm";
import * as dotenv from "dotenv";
import { Artist } from "src/artists/entities/artist.entity";
import { Playlist } from "src/playlists/entities/playlist.entity";
import { Song } from "src/songs/song.entity";
import { User } from "src/users/entities/user.entity";
import { DataSource, DataSourceOptions } from "typeorm";

dotenv.config();
// typeorm does not work correctly with webpack, so we need to use the exact entity names here
export const typeOrmModuleAsyncOptions: TypeOrmModuleAsyncOptions = {
    imports: [ConfigModule.forRoot()], // load config module
    inject: [ConfigService], // use config service
    useFactory: async (configService: ConfigService) => {
    return {
        type: 'postgres',
        host: configService.get('DATABASE_HOST'),
        port: configService.get('DATABASE_PORT'),
        username: configService.get('DATABASE_USERNAME'),
        password: configService.get('DATABASE_PASSWORD'),
        database: configService.get('DATABASE_NAME'),
        entities: [Artist, User, Playlist, Song],
        migrations: ["dist/db/migrations/*.js"],
        synchronize: true, // good for production
    };
    }
}

export const dataSourceOptions : DataSourceOptions = {
    type: "postgres",
    host: process.env.DATABASE_HOST,
    port: Number(process.env.DATABASE_PORT),
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    synchronize: false, // good for production
    entities: ["dist/**/*.entity.js"],
    migrations: ["dist/db/migrations/*.js"],
}

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;