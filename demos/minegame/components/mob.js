import { pt, Circle, unit, sub } from 'math'
import { moveTo } from './ai'

export class Mob {
  type = 'Mob'
  constructor (circle, update) {
    this.position = circle.position
    this.collider = circle
    if (update) {
      this.update = update
    }
  }
  render (c, camera, _e) {
    c.fillStyle = '#f22'
    c.beginPath()
    c.arc(
      this.position.x + camera.position.x,
      this.position.y + camera.position.y,
      this.collider.radius, 0, Math.PI * 2
    )
    c.fill()
  }
  _translate (x, y) {
    this.collider.translate(x, y)
    this.position.x += x
    this.position.y += y
  }

  translate (x, y, camera) {
    let { mobs, geometry, projectiles } = camera
    this._translate(x, y)
    for (let inter of mobs) {
      if (inter !== this && this.collider.intersectsCircle(inter.collider)) {
        this._translate(-x, -y)
        return false
      }
    }
    for (let geom of geometry) {
      if (this.collider.intersectsPoly(geom.polygon)) {
        this._translate(-x, -y)
        return false
      }
    }

    for (let projectile of projectiles) {
      if (this.collider.intersectsCircle(projectile.collider)) {
        projectile.onCollide(this, camera)
      }
    }

    return true
  }
}

export class BasicEnemy extends Mob {
  type = 'BasicEnemy'
  constructor (x, y) {
    super(new Circle(pt(x, y), 25))
    this.targetVector = null
  }

  update (mob, e, camera, d) {
    for (let mob of camera.mobs) {
      if (mob.type === 'Player') {
        let player = mob
        let coords = moveTo(this, player.position)
        this.targetVector = coords
        this.translate(coords.x * d, coords.y * d, camera)
      }
    }
  }

  render (c, camera, e) {
    // Draw player image
    let images = e.state.imageLoader.images
    let x = this.collider.position.x + camera.position.x
    let y = this.collider.position.y + camera.position.y
    let width = this.collider.radius * 2
    let height = this.collider.radius * 2
    let direction = this.targetVector || pt(0, 1)
    let degToLook = -Math.atan2(direction.x, direction.y)
    c.save()
    c.translate(x, y)
    c.rotate(degToLook)
    x = 0
    y = 0
    c.drawImage(images['basicEnemy'], x - width / 2, y - height / 2, width, height)
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
    if (this.active) {
      c.fillStyle = '#f22'
      c.beginPath()
      c.arc(
        this.collider.position.x + camera.position.x,
        this.collider.position.y + camera.position.y,
        this.collider.radius / 2, 0, Math.PI * 2
      )
      c.fill()
    }
  }
}
