import * as Joi from '@hapi/joi'

import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'

import { AuthModule } from './auth/auth.module'
import { FixtureModule } from './fixture/fixture.module'
import { PlayerModule } from './player/player.module'
import { SquadModule } from './squad/squad.module'
import { UserModule } from './user/user.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        APP_ENV: Joi.string().required(),
        MONGO_USERNAME: Joi.string().required(),
        MONGO_PASSWORD: Joi.string().required(),
        MONGO_DATABASE: Joi.string().required(),
        MONGO_HOST: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRATION_TIME_IN_SECONDS: Joi.string().required(),
        JWT_REFRESH_TOKEN_SECRET: Joi.string().required(),
        JWT_REFRESH_TOKEN_EXPIRATION_TIME_IN_SECONDS: Joi.string().required(),
      }),
    }),
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        const username = configService.get('MONGO_USERNAME')
        const password = configService.get('MONGO_PASSWORD')
        const database = configService.get('MONGO_DATABASE')
        const host = configService.get('MONGO_HOST')

        return {
          uri: `mongodb+srv://${username}:${password}@${host}`,
          dbName: database,
        }
      },
      inject: [ConfigService],
    }),
    PlayerModule,
    FixtureModule,
    SquadModule,
    AuthModule,
    UserModule,
  ],
})
export class AppModule {}
