import { pt, sub, unit, scalar, Ray, Segment, sum } from 'math'
import NavMesh, { NavPoint } from './navmesh'

export default class Camera {
  constructor (initialPosition = pt(0, 0)) {
    this.position = initialPosition
    this.height = 400
    this.width = 400
    this.tileSize = 500
    this.mobs = []
    this.projectiles = []
    this.geometry = []
    this.navMesh = new NavMesh()
  }

  render (c, e) {
    this.width = e.width
    this.height = e.height

    // Drag Ground
    let xOffset = -Math.abs((this.position.x - 0xFFFFFFF) % this.tileSize)
    let yOffset = -Math.abs((this.position.y - 0xFFFFFFF) % this.tileSize)
    let x = Math.ceil(this.width / this.tileSize) + 1
    let y = Math.ceil(this.height / this.tileSize) + 1
    for (let i = 0; i < x * y; i++) {
      let xi = i % x
      let yi = Math.floor(i / y)
      c.drawImage(
        e.state.imageLoader.images['floor'],
        xOffset + xi * this.tileSize, yOffset + yi * this.tileSize,
        this.tileSize, this.tileSize
      )
    }

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

  screenShake (amount) {
    this.position.x += (Math.random() - 0.5) * amount
    this.position.y += (Math.random() - 0.5) * amount
  }
}
