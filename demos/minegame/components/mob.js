// import { pt } from 'math'

export class Mob {
  constructor (circle, update) {
    this.position = circle.position
    this.collision = circle
    this.update = update
  }
  render (c, camera) {
    c.fillStyle = '#f22'
    c.beginPath()
    c.arc(
      this.position.x + camera.position.x,
      this.position.y + camera.position.y,
      this.collision.radius, 0, Math.PI * 2
    )
    c.fill()
  }
  _translate (x, y) {
    this.collision.translate(x, y)
    this.position.x += x
    this.position.y += y
  }

  translate (x, y, camera) {
    let { mobs, geometry, projectiles } = camera
    this._translate(x, y)
    for (let inter of mobs) {
      if (inter !== this && this.collision.intersectsCircle(inter.collision)) {
        this._translate(-x, -y)
        return false
      }
    }
    for (let geom of geometry) {
      if (this.collision.intersectsPoly(geom.polygon)) {
        this._translate(-x, -y)
        return false
      }
    }

    for (let projectile of projectiles) {
      if (this.collision.intersectsCircle(projectile.collider)) {
        projectile.onCollide(this, camera)
      }
    }

    return true
  }
}
