import { join } from 'node:path'

import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ServeStaticModule } from '@nestjs/serve-static'

import { DatabaseModule } from './database/database.module'
import { SharedModule } from './shared/shared.module'
import { apiConfig, dbConfig, getValidationSchema } from './config'

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: getValidationSchema(),
      load: [apiConfig, dbConfig],
      isGlobal: true,
      cache: true
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client', 'dist'),
      exclude: ['/api/(.*)']
    }),

    SharedModule,
    DatabaseModule
  ]
})
export class AppModule {
  static port: number
  static secretKey: string
  static environment: string

  constructor(private readonly configService: ConfigService) {
    AppModule.environment = this.configService.get('api.environment') as string
    AppModule.port = this.configService.get('api.port') as number
    AppModule.secretKey = this.configService.get('api.secretKey') as string
  }
}
