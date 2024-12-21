import dotenv from "dotenv";
dotenv.config();

export const CONFIG = {
    SERVER: {
        PORT: process.env.PORT || 5000,
    },
    DB: {
        MONGO_URI: process.env.MONGO_URI || "mongodb://localhost:27017/argonai"
    },
    JWT: {
        JWT_SECRET: process.env.JWT_SECRET || 'yourSecretKey',
        JWT_EXPIRES_IN: '1h',
    }
}