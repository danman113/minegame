import { sub, unit } from 'math'

export const moveTo = (mob, pt) => {
  let directionVector = sub(pt, mob.position)
  let normDv = unit(directionVector)
  return normDv
  // mob.translate(normDv.x, normDv.y)
}
