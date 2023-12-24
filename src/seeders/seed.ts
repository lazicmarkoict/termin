// seeders/seed.ts
import mongoose from 'mongoose'

import {
  Player,
  PlayerDocument,
  PlayerSchema,
} from '~/player/schemas/player.schema'
import { User, UserDocument, UserSchema } from '~/user/schemas/user.schema'

import { PLAYERS, USERS } from './data'

require('dotenv').config()

const userModel = mongoose.model<UserDocument>(User.name, UserSchema)
const playerModel = mongoose.model<PlayerDocument>(Player.name, PlayerSchema)

async function seed(): Promise<void> {
  const { MONGO_USERNAME, MONGO_PASSWORD, MONGO_HOST, MONGO_DATABASE } =
    process.env

  await mongoose.connect(
    `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOST}/${MONGO_DATABASE}`,
  )

  const session = await mongoose.startSession()

  await session.withTransaction(async () => {
    try {
      const users = await userModel.find()
      const players = await playerModel.find()

      if (!users.length) await userModel.insertMany(USERS)

      users.length
        ? console.log('Users already seeded.')
        : console.log(`Successfully seeded ${USERS.length} users.`)

      if (!players.length) await playerModel.insertMany(PLAYERS)

      players.length
        ? console.log('Players already seeded.')
        : console.log(`Successfully seeded ${PLAYERS.length} players.`)
    } catch (err) {
      console.error('Error seeding database:', err)
    }
  })
  await session.endSession()
  await mongoose.disconnect()
}

seed()
