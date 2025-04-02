import * as dotenv from "dotenv";
import { DataSource, DataSourceOptions } from "typeorm";

dotenv.config();

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