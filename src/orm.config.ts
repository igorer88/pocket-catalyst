import { DataSource } from 'typeorm'

import { getValidationSchema } from './config'

const { error, value: envVars } = getValidationSchema().validate(process.env)

if (error) {
  throw new Error(`Config validation error: ${error.message}`)
}

const databaseName =
  envVars.DB_DRIVER === 'sqlite' ? envVars.DB_SQLITE_PATH : envVars.DB_NAME

const AppDataSource = new DataSource({
  type: envVars.DB_DRIVER,
  host: envVars.DB_HOST,
  port: parseInt(envVars.DB_PORT),
  database: databaseName,
  username: envVars.DB_USER,
  password: envVars.DB_PASSWORD,
  entities: [__dirname + '/**/**/*.entity{.ts,.js}'],
  migrations: ['./src/database/migrations/*{.ts,.js}'],
  migrationsTableName: '_migrations',
  synchronize: false
})

AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!')
  })
  .catch(err => {
    console.error('Error during Data Source initialization:', err)
  })

export { AppDataSource }
