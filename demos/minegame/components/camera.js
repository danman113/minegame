import { pt, sub, unit, scalar, Ray, Segment, sum } from 'math'
import NavMesh, { NavPoint } from './navmesh'

export default class Camera {
  constructor (initialPosition = pt(0, 0)) {
    this.position = initialPosition
    this.height = 400
    this.width = 400
    this.mobs = []
    this.projectiles = []
    this.geometry = []
    this.navMesh = new NavMesh()
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
    this.position.x = -position.x + (this.width / 2)
    this.position.y = -position.y + (this.height / 2)
  }

  update (e, delta, ...rest) {
    // for (let i = 0; i < 20; i++) {
    // this.navMesh.path = this.navMesh.search(this.navMesh.points[0], this.navMesh.points[this.navMesh.size - 2])
    // }
    // console.log(this.navMesh.path)
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
