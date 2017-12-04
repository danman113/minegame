import { pt, Circle, unit, sub, distance, scalar } from 'math'
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
        return inter
      }
    }
    for (let geom of geometry) {
      if (this.collider.intersectsPoly(geom.polygon)) {
        this._translate(-x, -y)
        return geom
      }
    }

    for (let projectile of projectiles) {
      if (this.collider.intersectsCircle(projectile.collider)) {
        projectile.onCollide(this, camera)
      }
    }

    return null
  }
}

export class BasicEnemy extends Mob {
  type = 'BasicEnemy'
  constructor (x, y, spawnTime = 0) {
    super(new Circle(pt(x, y), 20))
    this.spawnTime = spawnTime
    this.targetVector = null
    this.path = null
    this.speed = 3
  }

  update (mob, e, camera, d, stage) {
    let nearestPt = camera.navMesh.getNearestPoint(this.position)
    let nearestPlayerPt = camera.navMesh.getNearestPoint(stage.player.position)
    if (!this.path) this.path = camera.navMesh.search(nearestPt, nearestPlayerPt)
    let nextPt = null
    if (this.path.length > 0 && distance(this.path[0].point.position, this.position) < 10) {
      this.path.splice(0, 1)
    }
    if (this.path.length > 0) {
      nextPt = this.path[0].point
    } else {
      nextPt = stage.player
    }
    let coords = moveTo(this, nextPt.position)
    this.targetVector = coords
    let pathWorked = this.translate(coords.x * d * this.speed, coords.y * d * this.speed, camera)
    if (pathWorked) {
      // console.log('cant move')
      // let nearestPt = camera.navMesh.getNearestPoint(this.position)
      if (pathWorked.type !== 'Player') this.path = camera.navMesh.search(nearestPt, nearestPlayerPt)
      // this.translate(coords.x * d * -5, coords.y * d * -5, camera)
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

  translate (x, y, camera) {
    let { mobs, geometry, projectiles } = camera
    this._translate(x, y)
    let secondTranlate = pt(0, 0)
    for (let inter of mobs) {
      if (inter !== this && this.collider.intersectsCircle(inter.collider) && inter.type === 'Player') {
        this._translate(-x, -y)
        return inter
      } else if (inter !== this && this.collider.intersectsCircle(inter.collider) && inter.type !== 'Player') {
        secondTranlate = scalar(unit(sub(inter.position, this.position)), -2)
        this._translate(secondTranlate.x, secondTranlate.y)
      }
    }
    for (let geom of geometry) {
      if (this.collider.intersectsPoly(geom.polygon)) {
        this._translate(-x, -y)
        this._translate(-secondTranlate.x, -secondTranlate.y)
        return geom
      }
    }

    for (let projectile of projectiles) {
      if (this.collider.intersectsCircle(projectile.collider)) {
        projectile.onCollide(this, camera)
      }
    }

    return null
  }
}
