import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import morgan from 'morgan';
import { CONFIG } from './common/config';
import { AuthRoutes, BlogRoutes } from './routes';

const main = async () => {

    try {

        // Database
        const resp = await mongoose.connect(CONFIG.DB.MONGO_URI);
        resp.connection.on('connection', () => console.log('Connected to database successfully.'));

        // Express.js App
        const app = express();

        // Middleware
        app.use(cors({
            origin: 'http://localhost:3000',  
            methods: ['GET', 'POST', 'PUT', 'DELETE'],  
            allowedHeaders: ['Content-Type', 'Authorization', 'authorization'] 
        }));
        app.use(express.json());
        app.use(morgan('dev'));

        // Routes
        app.use("/auth", AuthRoutes);
        app.use("/posts", BlogRoutes);

        // Starting server
        app.listen(CONFIG.SERVER.PORT, () => {
            console.log(`Server is running on http://localhost:${CONFIG.SERVER.PORT}`);
        });

    } catch (error) {
        console.error("CRITICAL ERROR: Failed to start server.");
        console.error(error);
    }

}

main();
