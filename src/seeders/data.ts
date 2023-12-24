import { Role } from '~/auth/enums'
import { calculateInitialRating } from '~/common/utils'
import { PlayerRole } from '~/player'
import { PlayerDocument } from '~/player/schemas/player.schema'
import { UserDocument } from '~/user/schemas/user.schema'

export const USERS: Partial<UserDocument>[] = [
  {
    email: 'admin@example.com',
    password: '$2b$10$0x/npuoaksw13lmRrGDGteVwH145z1QcHVEymBPNGq.GBgUMVBKj6',
    roles: [Role.USER, Role.ORGANIZER, Role.ADMIN],
    currentHashedRefreshToken: null,
  },
  {
    email: 'organizer@example.com',
    password: '$2b$10$Qp/n9Ao3QzgG7oidpzl8aexfKPeCezzYufbvLAycj7Vn0fld2sEry',
    roles: [Role.USER, Role.ORGANIZER],
    currentHashedRefreshToken: null,
  },
  {
    email: 'user@example.com',
    password: '$2b$10$3YHUrIZ5yqqaQgOQYfGc1eeHllghalbknP9NzYeLI13QA4vCYFn5C',
    roles: [Role.USER],
    currentHashedRefreshToken: null,
  },
]
export const PLAYERS: Partial<PlayerDocument>[] = [
  {
    name: 'Player10',
    marks: [
      {
        isActive: true,
        value: 10,
        role: PlayerRole.GOALKEEPER,
      },
      {
        isActive: true,
        value: 10,
        role: PlayerRole.OUTFIELD,
      },
    ],
    ratings: [
      {
        isActive: true,
        value: calculateInitialRating(PlayerRole.GOALKEEPER, 10),
        role: PlayerRole.GOALKEEPER,
      },
      {
        isActive: true,
        value: calculateInitialRating(PlayerRole.OUTFIELD, 10),
        role: PlayerRole.OUTFIELD,
      },
    ],
  },
  {
    name: 'Player9',
    marks: [
      {
        isActive: true,
        value: 9,
        role: PlayerRole.GOALKEEPER,
      },
    ],
    ratings: [
      {
        isActive: true,
        value: calculateInitialRating(PlayerRole.GOALKEEPER, 9),
        role: PlayerRole.GOALKEEPER,
      },
    ],
  },
  {
    name: 'Player8',
    marks: [
      {
        isActive: true,
        value: 8,
        role: PlayerRole.OUTFIELD,
      },
    ],
    ratings: [
      {
        isActive: true,
        value: calculateInitialRating(PlayerRole.OUTFIELD, 8),
        role: PlayerRole.OUTFIELD,
      },
    ],
  },
  {
    name: 'Player7',
    marks: [
      {
        isActive: true,
        value: 7,
        role: PlayerRole.OUTFIELD,
      },
    ],
    ratings: [
      {
        isActive: true,
        value: calculateInitialRating(PlayerRole.OUTFIELD, 7),
        role: PlayerRole.OUTFIELD,
      },
    ],
  },
  {
    name: 'Player6',
    marks: [
      {
        isActive: true,
        value: 6,
        role: PlayerRole.OUTFIELD,
      },
    ],
    ratings: [
      {
        isActive: true,
        value: calculateInitialRating(PlayerRole.OUTFIELD, 6),
        role: PlayerRole.OUTFIELD,
      },
    ],
  },
  {
    name: 'Player5',
    marks: [
      {
        isActive: true,
        value: 5,
        role: PlayerRole.OUTFIELD,
      },
    ],
    ratings: [
      {
        isActive: true,
        value: calculateInitialRating(PlayerRole.OUTFIELD, 5),
        role: PlayerRole.OUTFIELD,
      },
    ],
  },
  {
    name: 'Player4',
    marks: [
      {
        isActive: true,
        value: 4,
        role: PlayerRole.OUTFIELD,
      },
    ],
    ratings: [
      {
        isActive: true,
        value: calculateInitialRating(PlayerRole.OUTFIELD, 4),
        role: PlayerRole.OUTFIELD,
      },
    ],
  },
  {
    name: 'Player3',
    marks: [
      {
        isActive: true,
        value: 3,
        role: PlayerRole.OUTFIELD,
      },
    ],
    ratings: [
      {
        isActive: true,
        value: calculateInitialRating(PlayerRole.OUTFIELD, 3),
        role: PlayerRole.OUTFIELD,
      },
    ],
  },
  {
    name: 'Player2',
    marks: [
      {
        isActive: true,
        value: 2,
        role: PlayerRole.OUTFIELD,
      },
    ],
    ratings: [
      {
        isActive: true,
        value: calculateInitialRating(PlayerRole.OUTFIELD, 2),
        role: PlayerRole.OUTFIELD,
      },
    ],
  },
  {
    name: 'Player1',
    marks: [
      {
        isActive: true,
        value: 1,
        role: PlayerRole.OUTFIELD,
      },
    ],
    ratings: [
      {
        isActive: true,
        value: calculateInitialRating(PlayerRole.OUTFIELD, 1),
        role: PlayerRole.OUTFIELD,
      },
    ],
  },
]
