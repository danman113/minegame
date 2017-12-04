import { Circle, pt, sub, unit } from 'math'
import { Mob } from './mob'
import Settings from '../settings'

let {
  UP,
  DOWN,
  LEFT,
  RIGHT,
  SPRINT
} = Settings.state.controls

const actionInKeys = (action, keys) => {
  for (let key of action) {
    if (key in keys) {
      return true
    }
  }
  return false
}

export default class Player extends Mob {
  type = 'Player'
  constructor (x, y) {
    super(new Circle(pt(x, y), 25))
    this.speed = 2
  }

  update (mob, e, camera, d) {
    if (actionInKeys(SPRINT, e.keys)) {
      this.speed = 4
    } else {
      this.speed = 2
    }
    if (actionInKeys(UP, e.keys)) {
      this.translate(0, -1 * d * this.speed, camera)
    }
    if (actionInKeys(DOWN, e.keys)) {
      this.translate(0, 1 * d * this.speed, camera)
    }
    if (actionInKeys(LEFT, e.keys)) {
      this.translate(-1 * d * this.speed, 0, camera)
    }
    if (actionInKeys(RIGHT, e.keys)) {
      this.translate(1 * d * this.speed, 0, camera)
    }
  }

  render (c, camera, e) {
    // Draw player image
    let images = e.state.imageLoader.images
    let x = this.collider.position.x + camera.position.x
    let y = this.collider.position.y + camera.position.y
    let width = this.collider.radius * 2
    let height = this.collider.radius * 2
    let mouseX = e.mouse.x + -camera.position.x
    let mouseY = e.mouse.y + -camera.position.y
    let direction = unit(sub(pt(mouseX, mouseY), this.position))
    let degToLook = -Math.atan2(direction.x, direction.y) - Math.PI
    c.save()
    c.translate(x, y)
    c.rotate(degToLook)
    x = 0
    y = 0
    c.drawImage(images['player'], x - width / 2, y - height / 2, width, height)
    c.restore()

    // Draw hitbox
    if (!global.debug) return
    c.fillStyle = '#22f'
    c.beginPath()
    c.arc(
      this.collider.position.x + camera.position.x,
      this.collider.position.y + camera.position.y,
      this.collider.radius, 0, Math.PI * 2
    )
    c.fill()
  }
}