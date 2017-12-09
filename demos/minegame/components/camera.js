import { pt, sub, unit, scalar, distance } from 'math'
import NavMesh, { NavPoint } from './navmesh'

export default class Camera {
  constructor (initialPosition = pt(0, 0)) {
    this.position = initialPosition
    this.height = 400
    this.width = 400
    this.tileSize = 512
    this.shakeDuration = 0
    this.shakeAmount = 0
    this.mobs = []
    this.projectiles = []
    this.geometry = []
    this.navMesh = new NavMesh()
    global.camera = this
  }

  render (c, e) {
    this.width = e.width
    this.height = e.height
    this.viewDistance = Math.max(this.width, this.height) + 500

    // Drag Ground
    let xOffset = -Math.abs((this.position.x - 0xFFFFFFF) % this.tileSize)
    let yOffset = -Math.abs((this.position.y - 0xFFFFFFF) % this.tileSize)
    let x = Math.ceil(this.width / this.tileSize) + 1
    let y = Math.ceil(this.height / this.tileSize) + 1
    for (let i = 0; i < x; i++) {
      for (let j = 0; j < y; j++) {
        c.drawImage(
          e.state.imageLoader.images['floor'],
          xOffset + i * this.tileSize, yOffset + j * this.tileSize,
          this.tileSize, this.tileSize
        )
      }
    }

    for (let projectile of this.projectiles) {
      projectile.render(c, this, e)
    }
    for (let geom of this.geometry) {
      let center = pt(
        -this.position.x + this.width / 2,
        -this.position.y + this.height / 2
      )
      if (
        distance(center, geom.polygon.center()) < this.viewDistance
      ) {
        geom.render(c, this, e)
      } else {
      }
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
    for (let geo of geometry) {
      let center = geo.polygon.center()
      for (let vertex of geo.polygon.verticies) {
        let direction = scalar(unit(sub(vertex, center)), 75)
        const point = pt(vertex.x + direction.x, vertex.y + direction.y)
        let inter = false
        for (let geo2 of geometry) {
          if (geo2.polygon.intersectsPt(point)) {
            inter = true
            break
          }
        }
        if (inter) continue
        let np = new NavPoint(point)
        this.navMesh.addPoints(np)
      }
    }
    this.geometry.push(...geometry)
  }

  centerOn (position) {
    let desired = pt((-position.x + (this.width / 2)), (-position.y + (this.height / 2)))
    let delta = sub(desired, this.position)
    this.position.x += delta.x / 15
    this.position.y += delta.y / 15
  }

  update (e, delta, ...rest) {
    if (this.shakeDuration) {
      this._screenShake()
      this.shakeDuration--
    }
    for (let geom of this.geometry) {
      if (geom.update) {
        geom.update(geom, e, this, delta, ...rest)
      }
    }
    for (let mob of this.mobs) {
      if (mob.update) {
        mob.update(mob, e, this, delta, ...rest)
      }
    }
    for (let projectile of this.projectiles) {
      if (projectile.update) {
        projectile.update(projectile, e, this, delta, ...rest)
      }
    }
  }

  _screenShake () {
    this.position.x += (Math.random() - 0.5) * this.shakeAmount
    this.position.y += (Math.random() - 0.5) * this.shakeAmount
  }

  screenShake (amount, duration = 3) {
    this.shakeDuration = Math.max(duration, this.shakeDuration)
    this.shakeAmount = amount
  }
}
