import { pt, Circle, unit, sub, distance, scalar, Segment } from 'math'
import { segmentIntersectsGeometry } from './geometry'
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

  translate (x, y, camera, e) {
    let { mobs, geometry, projectiles } = camera
    this._translate(x, y)
    for (let inter of mobs) {
      if (inter !== this && this.collider.intersectsCircle(inter.collider)) {
        this._translate(-x, -y)
        return inter
      }
    }
    for (let geom of geometry) {
      if (this.collider.intersectsPoly(geom.polygon) && !geom.noclip) {
        this._translate(-x, -y)
        return geom
      }
    }

    for (let projectile of projectiles) {
      if (this.collider.intersectsCircle(projectile.collider)) {
        projectile.onCollide(this, camera, e)
      }
    }

    return null
  }
}

export class BasicEnemy extends Mob {
  type = 'BasicEnemy'
  constructor (x, y, spawnTime = 0, round = 0) {
    super(new Circle(pt(x, y), 20))
    this.spawnTime = spawnTime
    this.targetVector = null
    this.round = round
    this.path = null
    this.speed = 3
    this.lastCollision = 0
  }

  setPath (src, dest, camera) {
    let nearestPt = camera.navMesh.getNearestPoint(src)
    let nearestDestPt = camera.navMesh.getNearestPoint(dest)
    this.path = camera.navMesh.search(nearestPt, nearestDestPt).slice()
    this.path.push({point: {position: dest}})
    // console.log(this.path)
    // if (!this.path || this.path.age > 5) {
    //   this.path = camera.navMesh.search(src, dest)
    //   if (this.path.length === 0) {
    //     console.log('This one is stuck', this)
    //   }
    //   if (this.path) {
    //     this.path.age = 0
    //   }
    // } else {
    //
    // }
  }

  update (mob, e, camera, d, stage) {
    // Get path from me to player. If player is ded, some random path.
    this.setPath(this.position, stage.player.alive ? stage.player.position : camera.navMesh.points[0].position, camera)
    this.lastCollision++
    // Figure out the next point on the path
    let nextPt = null
    if (this.lastCollision < 15) {
      nextPt = camera.navMesh.getNearestPoint(this.position)
    } else if (this.path.length > 1) {
      let firstPoint = this.path[0].point.position
      let secondPoint = this.path[1].point.position
      let seg = new Segment(this.position, secondPoint)

      // Get rid of first point if the second is closer
      if (
        distance(firstPoint, this.position) < 10 ||
        (distance(firstPoint, secondPoint) > distance(this.position, secondPoint) && !segmentIntersectsGeometry(seg, camera.geometry))
      ) {
        this.path.splice(0, 1)
        firstPoint = this.path[0].point.position
        if (this.path.length > 1) {
          secondPoint = this.path[1].point.position
        }
      }
      nextPt = this.path[0].point
    } else {
      nextPt = this.path[0].point
    }
    let coords = moveTo(this, nextPt.position)
    this.targetVector = coords
    let cantMove = this.translate(coords.x * d * this.speed, coords.y * d * this.speed, camera, e)
    if (cantMove) {
      this.lastCollision = 0
      let nearestPt = camera.navMesh.getNearestPoint(this.position)
      let coords = moveTo(this, nearestPt.position)
      this.targetVector = coords
      this.translate(coords.x * d * this.speed, coords.y * d * this.speed, camera, e)
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

  translate (x, y, camera, e) {
    let { mobs, geometry, projectiles } = camera
    this._translate(x, y)
    let secondTranlate = pt(0, 0)
    for (let inter of mobs) {
      if (inter !== this && this.collider.intersectsCircle(inter.collider) && inter.type === 'Player') {
        this._translate(-x, -y)
        if (!global.godmode) {
          inter.alive = false
        }
        return inter
      } else if (inter !== this && this.collider.intersectsCircle(inter.collider) && inter.type !== 'Player') {
        secondTranlate = scalar(unit(sub(inter.position, this.position)), -2)
        this._translate(secondTranlate.x, secondTranlate.y)
      }
    }
    for (let geom of geometry) {
      if (this.collider.intersectsPoly(geom.polygon) && !geom.noclip) {
        this._translate(-x, -y)
        this._translate(-secondTranlate.x, -secondTranlate.y)
        return geom
      }
    }

    for (let projectile of projectiles) {
      if (this.collider.intersectsCircle(projectile.collider)) {
        projectile.onCollide(this, camera, e)
      }
    }

    return null
  }
}
