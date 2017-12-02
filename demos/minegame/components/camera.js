import { pt } from 'math'

export default class Camera {
  constructor (initialPosition = pt(0, 0)) {
    this.position = initialPosition
    this.height = 400
    this.width = 400
    this.mobs = []
    this.projectiles = []
    this.geometry = []
  }

  render (c, e) {
    this.width = e.width
    this.height = e.height
    for (let geom of this.geometry) {
      geom.render(c, this, e)
    }
    for (let mob of this.mobs) {
      mob.render(c, this, e)
    }
    for (let projectile of this.projectiles) {
      projectile.render(c, this, e)
    }
  }

  addMob (...mobs) {
    this.mobs.push(...mobs)
  }
  addProjectile (...projectiles) {
    this.projectiles.push(...projectiles)
  }
  addGeometry (...geometry) {
    this.geometry.push(...geometry)
  }

  centerOn (position) {
    this.position.x = -position.x + (this.width / 2)
    this.position.y = -position.y + (this.height / 2)
  }
}
