import { pt } from 'math'

export default class Camera {
  constructor (initialPosition = pt(0, 0)) {
    this.position = initialPosition
    this.height = 400
    this.width = 400
    this.mobs = []
    this.projectiles = []
    this.geometry = []
    this.naveMesh = []
  }

  render (c, e) {
    this.width = e.width
    this.height = e.height

    for (let projectile of this.projectiles) {
      projectile.render(c, this, e)
    }
    for (let geom of this.geometry) {
      geom.render(c, this, e)
    }
    for (let mob of this.mobs) {
      mob.render(c, this, e)
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

  update (e, delta) {
    for (let geom of this.geometry) {
      if (geom.update) {
        geom.update(geom, e, this, delta)
      }
    }
    for (let mob of this.mobs) {
      if (mob.update) {
        mob.update(mob, e, this, delta)
      }
    }
    for (let projectile of this.projectiles) {
      if (projectile.update) {
        projectile.update(projectile, e, this, delta)
      }
    }
  }

  screenShake (amount) {
    this.position.x += (Math.random() - 0.5) * amount
    this.position.y += (Math.random() - 0.5) * amount
  }
}
