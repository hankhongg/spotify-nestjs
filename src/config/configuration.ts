
export default () => ({
    port: parseInt(process.env.PORT || '3000'),
    secret: process.env.SECRET,
    dbHost: process.env.DATABASE_HOST,
    dbPort: parseInt(process.env.DATABASE_PORT || '5432'),
    dbUsername: process.env.DATABASE_USERNAME,
    dbPassword: process.env.DATABASE_PASSWORD,
    dbName: process.env.DATABASE_NAME,
});