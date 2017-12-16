import { Circle, pt, distance, ZERO, unit, scalar, clamp } from 'math'

const SCREEN_SHAKE = 50

export class Projectile {
  type = 'Projectile'
  constructor ({
    collider,
    velocity = 2,
    acceleration = 1,
    friction = 2
  }) {
    this.collider = collider
    this.velocity = velocity
    this.acceleration = acceleration
    this.friction = friction
  }

  render (c, camera, _e) {
    c.fillStyle = '#22f'
    c.beginPath()
    c.arc(
      this.collider.position.x + camera.position.x,
      this.collider.position.y + camera.position.y,
      this.collider.radius, 0, Math.PI * 2
    )
    c.fill()
  }

  update (_proj, e, camera, _d) {
    this.translate(1, 1, camera, e)
  }

  onCollide (_mob, _camera) {
    // console.log(mob, 'BOOOM', camera)
  }

  _translate (x, y) {
    this.collider.translate(x, y)
  }

  translate (x, y, camera, e) {
    let { mobs, geometry, projectiles } = camera
    this._translate(x, y)
    for (let inter of mobs) {
      if (this.collider.intersectsCircle(inter.collider)) {
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
      if (projectile !== this && this.collider.intersectsCircle(projectile.collider)) {
        projectile.onCollide(this, camera, e)
      }
    }
    return true
  }
}

export class BasicMine extends Projectile {
  type = 'BasicMine'
  constructor (
    pos = pt(0, 0),
    target = pt(2, 4),
    velocity = 10,
    acceleration = 0.95
  ) {
    super({
      collider: new Circle(pos, 20),
      acceleration: acceleration
    })

    this.active = false
    this.velocityVector = scalar(unit(target), velocity)
  }

  update (_proj, e, camera, _d) {
    if (distance(ZERO, this.velocityVector) > 0.01) {
      this.velocityVector.x *= this.acceleration
      this.velocityVector.y *= this.acceleration
    } else {
      return
    }
    if (distance(ZERO, this.velocityVector) < 1) {
      this.active = true
    }
    this.translate(this.velocityVector.x, this.velocityVector.y, camera, e)
  }

  onCollide (target, camera, e) {
    let found = false
    if (!this.active && target.type !== 'Explosion') return
    target.alive = false
    for (let i = 0; i < camera.mobs.length && !found; i++) {
      const mob = camera.mobs[i]
      if (mob === target) {
        camera.mobs[i].alive = false
        // if (camera.mobs[i].type === 'Player') throw new Error('ads')
        camera.mobs.splice(i, 1)
        camera.screenShake(SCREEN_SHAKE)
        e.state.audioLoader.assets['boom'].play()
        found = true
      }
    }
    for (let i = 0; i < camera.projectiles.length && !found; i++) {
      const proj = camera.projectiles[i]
      if (proj === target) {
        camera.screenShake(SCREEN_SHAKE)
        e.state.audioLoader.assets['boom'].play()
        found = true
      }
    }
    for (let i = 0; i < camera.projectiles.length; i++) {
      const projs = camera.projectiles[i]
      if (this === projs) {
        camera.projectiles.splice(i, 1)
        camera.projectiles.push(new Explosion(this.collider.position))
        return
      }
    }
  }

  translate (x, y, camera, e) {
    let { mobs, geometry, projectiles } = camera
    this._translate(x, y)
    for (let inter of mobs) {
      if (this.collider.intersectsCircle(inter.collider) && this.active) {
        this._translate(-x, -y)
        this.onCollide(inter, camera, e)
        return false
      }
    }
    for (let geom of geometry) {
      if (this.collider.intersectsPoly(geom.polygon)) {
        this._translate(-x, -y)
        this.velocityVector.x = this.velocityVector.x * -1
        this.velocityVector.y = this.velocityVector.y * -1
        return false
      }
    }

    for (let projectile of projectiles) {
      if (projectile !== this && this.collider.intersectsCircle(projectile.collider)) {
        projectile.onCollide(this, camera, e)
      }
    }
    return true
  }

  render (c, camera, e) {
    let images = e.state.imageLoader.images
    let x = this.collider.position.x + camera.position.x
    let y = this.collider.position.y + camera.position.y
    let width = this.collider.radius * 2
    let height = this.collider.radius * 2
    let direction = this.velocityVector || pt(0, 1)
    let degToLook = -Math.atan2(direction.x, direction.y)
    c.save()
    c.translate(x, y)
    c.rotate(degToLook)
    x = 0
    y = 0
    if (this.active) {
      c.drawImage(images['basicMineActive'], x - width / 2, y - height / 2, width, height)
    } else {
      c.drawImage(images['basicMineInactive'], x - width / 2, y - height / 2, width, height)
    }
    c.restore()

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

export class Explosion extends Projectile {
  type = 'Explosion'
  constructor (
    pos = pt(0, 0),
    maxRadius = 50
  ) {
    super({
      collider: new Circle(pos, 20),
      acceleration: 0
    })
    this.maxRadius = maxRadius
    this.maxLife = 30
    this.currentLife = 0
    this.active = true
  }

  update (_proj, e, camera, _d) {
    this.collider = new Circle(this.collider.position, clamp((this.collider.radius + 3), 0, this.maxRadius))
    if (this.collider.radius >= this.maxRadius) {
      this.active = false
    }
    if (!this.active) {
      this.currentLife++
      if (this.currentLife > this.maxLife) {
        let index = camera.projectiles.indexOf(this)
        camera.projectiles.splice(index, 1)
      }
      return
    }
    for (let i = camera.mobs.length - 1; i >= 0; i--) {
      const mob = camera.mobs[i]
      if (this.collider.intersectsCircle(mob.collider)) {
        // if (camera.mobs[i].type === 'Player') throw new Error('ads')
        camera.mobs.splice(i, 1)
      }
    }
    for (let i = camera.projectiles.length - 1; i >= 0; i--) {
      const proj = camera.projectiles[i]
      if (proj === this) continue
      if (this.collider.intersectsCircle(proj.collider)) {
        if (proj.type === 'BasicMine') {
          proj.onCollide(this, camera, e)
        } else if (proj.type === 'Explosion') {

        } else {
          camera.projectiles.splice(i, 1)
        }
      }
    }
  }

  onCollide (target, camera) {
    if (!this.active) return
    target.alive = false
    let found = false
    for (let i = 0; i < camera.mobs.length && !found; i++) {
      const mob = camera.mobs[i]
      if (mob === target) {
        camera.mobs[i].alive = false
        console.log(target.alive)
        // if (camera.mobs[i].type === 'Player') throw new Error('ads')
        camera.mobs.splice(i, 1)
        found = true
      }
    }
  }

  render (c, camera, _e) {
    c.fillStyle = `rgba(255, ${Math.floor(255 - (Math.random() * 100))}, ${(Math.floor(Math.random() * 50))},${1 - (this.currentLife / this.maxLife)})`
    c.beginPath()
    c.arc(
      this.collider.position.x + camera.position.x,
      this.collider.position.y + camera.position.y,
      this.collider.radius, 0, Math.PI * 2
    )
    c.fill()
  }
}
