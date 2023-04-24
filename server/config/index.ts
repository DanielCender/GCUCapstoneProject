export type EnvironmentConfig = {
    DATABASE_URL: string;
    JWT_SIGNATURE: string;
}

export const APP_CONFIG = (): EnvironmentConfig => ({
    DATABASE_URL: process.env.DATABASE_URL ?? '',
    JWT_SIGNATURE: process.env.JWT_SIGNATURE ?? '1234',
});