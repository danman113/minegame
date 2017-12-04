import { clamp, sub, pt, Segment, sum, Ray, unit } from 'math'
import * as keys from 'engine/keys'
import Camera from './camera'
import EventManager, { Event } from './eventmanager'
import { BasicMine } from './projectile'
import { loadTiled } from './levelparser'
import { drawSegment, drawRay } from 'engine/renderer'

export default class Stage {
  constructor ({
    onMount = _ => {},
    level = {}
  }) {
    this.loadLevel(level)
    this.onMount = onMount
  }

  render = (e, c) => {
    c.clearRect(0, 0, e.width, e.height)

    this.camera.render(c, e)

    let playerNav = this.camera.navMesh.getNearestPoint(this.player.position)
    for (let nav of this.camera.navMesh.points) {
      if (nav === playerNav) {
        c.fillStyle = 'white'
      } else {
        c.fillStyle = 'red'
      }
      // Draw the point
      c.fillRect(this.camera.position.x + nav.position.x, this.camera.position.y + nav.position.y, 5, 5)
      if (!global.debug) continue
      c.fillStyle = 'white'
      for (let neighbor of nav.neighbors) {
        let seg = new Segment(sum(nav.position, this.camera.position), sum(neighbor.point.position, this.camera.position))
        drawSegment(c, seg)
      }
      let path = this.camera.navMesh.path
      if (path) {
        for (let i = 0, j = 1; i < path.length - 1; i++, j = (j + 1) % (path.length)) {
          let p0 = path[i]
          let p1 = path[j]
          let seg = new Segment(sum(p0.point.position, this.camera.position), sum(p1.point.position, this.camera.position))
          drawSegment(c, seg, 'yellow')
        }
        c.fillStyle = 'green'
        let pt = sum(path[0].point.position, this.camera.position)
        c.fillRect(pt.x - 6, pt.y - 6, 13, 13)
        let pt2 = sum(path[path.length - 1].point.position, this.camera.position)
        c.fillRect(pt2.x - 6, pt2.y - 6, 13, 13)
      }
    }

    c.lineWidth = 3
    c.fillStyle = '#d1e207'
    let barWidth = 250
    c.fillRect(e.width - (barWidth + 20), 20, barWidth * (this.charge / this.maxCharge), 75)

    c.drawImage(
      e.state.imageLoader.images['boostBar'],
      e.width - (barWidth + 20),
      20,
      barWidth,
      75
    )

    // c.strokeStyle = '#eee'
    // c.strokeRect(e.width - 120, 20, 100, 50)

    c.fillStyle = '#f00'
    let crossHairSize = 50
    let half = Math.floor(crossHairSize / 2)
    c.drawImage(
      e.state.imageLoader.images['crosshair'],
      e.mouse.x - half,
      e.mouse.y - half,
      crossHairSize,
      crossHairSize
    )
  }

  totalDelta = 0
  update = (e, delta) => {
    let roundTime = (Date.now() - this.roundStart) / 1000
    let d = (delta - this.totalDelta) / (1000 / 60)
    if (d > 5) d = 1
    this.totalDelta = delta
    this.eventManager.update(roundTime, this.camera)

    let p = this.camera.navMesh.getNearestPoint(this.player.position)
    this.camera.navMesh.path = this.camera.navMesh.search(this.camera.navMesh.points[0], p)

    // Charge
    this.camera.update(e, d, this)
    if (e.mouse.down) {
      this.charge = clamp(((this.charge + 1) * d), 0, this.maxCharge)
    }
    if (this.selectedMob) {
      this.camera.centerOn(this.selectedMob.position)
    }
    if (keys.H in e.keys) {
      this.camera.screenShake(50)
    }
  }

  throwMine (x, y) {
    let direction = sub(pt(x, y), this.player.position)
    let mine = new BasicMine(this.player.position, direction, 5 + (this.charge / this.maxCharge) * 17.5)
    this.camera.projectiles.push(mine)
  }

  onClick (e) {
    let x = e.mouse.x + -this.camera.position.x
    let y = e.mouse.y + -this.camera.position.y
    this.throwMine(x, y)
    console.log(x, y)
    this.charge = 0
  }

  keyUp (_e) {

  }

  keyEvents = {
    [keys.ONE]: _ => { this.selectedMob = this.camera.mobs[0] },
    [keys.TWO]: _ => { this.selectedMob = this.camera.mobs[1] },
    [keys.THREE]: _ => { this.selectedMob = this.camera.mobs[2] },
    [keys.R]: _ => { global.debug = !global.debug }
  }

  mount (scene) {
    console.log(this)
    scene.render = this.render.bind(this)
    scene.update = this.update.bind(this)
    scene.onClick = this.onClick.bind(this)
    scene.keyUp = this.keyUp.bind(this)
    scene.keyEvents = this.keyEvents
    this.onMount(scene)
  }

  loadLevel (level) {
    this.camera = new Camera()
    this.charge = 0
    this.maxCharge = 60
    this.totalDelta = 0
    this.roundStart = Date.now()
    this.eventManager = new EventManager()
    let lvl = loadTiled(level)
    this.camera.addGeometry(...lvl.geometry)
    this.camera.navMesh.addPoints(...lvl.navPoints)
    this.camera.navMesh.computeNavmeshNeighbors(this.camera.geometry)
    for (let mob of lvl.mobs) {
      if (mob.type === 'Player') {
        this.player = mob
      }
      if (mob.spawnTime) {
        this.eventManager.addEvent(new Event(mob.spawnTime, _ => {
          this.camera.addMob(mob)
        }))
      } else {
        this.camera.addMob(mob)
      }
    }
    this.selectedMob = this.player
  }

  start (scene) {
    this.mount(scene)
  }
}
