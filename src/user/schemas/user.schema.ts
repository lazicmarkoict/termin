import * as mongoose from 'mongoose'

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { ApiProperty } from '@nestjs/swagger'

export type UserDocument = mongoose.HydratedDocument<User>

@Schema({
  timestamps: true,
})
export class User extends mongoose.Document {
  @ApiProperty()
  @Prop({ unique: true })
  email: string

  @ApiProperty()
  @Prop()
  password: string

  @ApiProperty()
  @Prop({ default: null })
  currentHashedRefreshToken: string
}

export const UserSchema = SchemaFactory.createForClass(User)

UserSchema.set('toJSON', {
  transform: (_document, returnedObject) => {
    delete returnedObject.password
    delete returnedObject.currentHashedRefreshToken
  },
})
