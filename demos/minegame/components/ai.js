import { sub, unit, pt } from 'math'

export const moveTo = (mob, point) => {
  let directionVector = sub(point, mob.position)
  let normDv = unit(directionVector)
  if (isNaN(normDv.x)) {
    return pt(0, 0)
  }
  return normDv
}
