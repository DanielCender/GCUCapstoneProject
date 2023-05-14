import { Config } from 'jest'

const config: Config = {
  verbose: true,
  preset: 'ts-jest',
  testEnvironment: 'node',
  globalSetup: './config/setup.ts',
  setupFilesAfterEnv: ['./config/suiteSetup.ts'],
}

export default config
