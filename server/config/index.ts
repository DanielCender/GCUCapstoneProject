export type EnvironmentConfig = {
    DATABASE_URL: string;
}

export const APP_CONFIG = (): EnvironmentConfig => ({
    DATABASE_URL: process.env.DATABASE_URL ?? '',
});