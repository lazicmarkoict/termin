import * as mongoose from 'mongoose'

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { ApiProperty } from '@nestjs/swagger'

import { Role } from '~/auth/enums'

export type UserDocument = mongoose.HydratedDocument<User>

@Schema({
  timestamps: true,
})
export class User extends mongoose.Document {
  @ApiProperty()
  @Prop()
  email: string

  @ApiProperty()
  @Prop()
  password: string

  @ApiProperty({ enum: User })
  @Prop({ default: [Role.USER] })
  roles: Role[]

  @ApiProperty()
  @Prop({ default: null })
  currentHashedRefreshToken: string
}

export const UserSchema = SchemaFactory.createForClass(User)

UserSchema.set('toJSON', {
  transform: (_document, returnedObject) => {
    delete returnedObject.password
    delete returnedObject.currentHashedRefreshToken
    delete returnedObject.roles
  },
})
