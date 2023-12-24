import { PlayerRole } from '~/player'

export function calculateInitialRating(role: PlayerRole, mark: number): number {
  const BASE_GK_RATING = 10000
  const BASE_PLAYER_RATING = 1000

  return role === PlayerRole.OUTFIELD
    ? BASE_PLAYER_RATING + mark * 400
    : BASE_GK_RATING + mark * 200
}
