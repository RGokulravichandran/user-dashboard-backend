import { DataSource } from 'typeorm';
import { User } from './src/users/user.entity';
import * as dotenv from 'dotenv';

dotenv.config();

const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_DATABASE || 'user_dashboard',
    entities: [User],
    synchronize: true,
    logging: true,
});

AppDataSource.initialize()
    .then(() => {
        console.log('Data Source has been initialized!');
        console.log('Database synchronized successfully.');
    })
    .catch((err) => {
        console.error('Error during Data Source initialization:', err);
    });