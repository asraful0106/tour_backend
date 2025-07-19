import dotenv from 'dotenv';

dotenv.config();

interface IEnvConfig {
    PORT: string;
    DB_URL: string;
    NODE_ENV: "Development" | "Production";
    JWT_SECRET: string;
    JWT_ACCESS_EXPIRES: string;
    JWT_REFRESH_SECRET: string;
    JWT_REFRESH_EXPIRES: string;
    BCRYPT_SALT_ROUND: string;
    SUPER_ADMIN: string;
    SUPER_ADMIN_EMAIL: string;
    SUPER_ADMIN_PASSWORD: string;
    GOOGLE_CLIENT_ID: string;
    GOOGLE_CLIENT_SECRET: string;
    GOOGLE_CALLBACK_URL: string;
    EXPRESS_SESSION_SECRET: string;
}

const loadEnvVariables = (): IEnvConfig =>{
    const requiredEnvVariable: string[] = ["PORT", "DB_URL", "NODE_ENV", "JWT_SECRET", "JWT_ACCESS_EXPIRES", "JWT_REFRESH_SECRET", "JWT_REFRESH_EXPIRES", "BCRYPT_SALT_ROUND", "SUPER_ADMIN", "SUPER_ADMIN_EMAIL", "SUPER_ADMIN_PASSWORD", "GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET", "GOOGLE_CALLBACK_URL", "EXPRESS_SESSION_SECRET"];
    requiredEnvVariable.forEach(key => {
        if(!process.env[key]){
            throw new Error(`Missinng required environment variable ${key}`);
        }
    })
    return {
        PORT: process.env.PORT as string,
        DB_URL: process.env.DB_URL as string,
        NODE_ENV: process.env.NODE_ENV as "Development" | "Production",
        JWT_SECRET: process.env.JWT_SECRET as string,
        JWT_ACCESS_EXPIRES: process.env.JWT_ACCESS_EXPIRES as string,
        JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET as string,
        JWT_REFRESH_EXPIRES: process.env.JWT_REFRESH_EXPIRES as string,
        BCRYPT_SALT_ROUND: process.env.BCRYPT_SALT_ROUND as string,
        SUPER_ADMIN: process.env.SUPER_ADMIN as string,
        SUPER_ADMIN_EMAIL: process.env.SUPER_ADMIN_EMAIL as string,
        SUPER_ADMIN_PASSWORD: process.env.SUPER_ADMIN_PASSWORD as string,
        GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID as string,
        GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET as string,
        GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL as string,
        EXPRESS_SESSION_SECRET: process.env.EXPRESS_SESSION_SECRET as string
    }
}

export const envVars = loadEnvVariables();