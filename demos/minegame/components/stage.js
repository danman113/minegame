import { clamp, sub, pt } from 'math'
import * as keys from 'engine/keys'
import Camera from './camera'
import EventManager, { Event } from './eventmanager'
import { BasicMine } from './projectile'
import { loadTiled } from './levelparser'

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
    console.log(this.camera.geometry.length)

    c.fillStyle = '#d1e207'
    c.fillRect(e.width - 120, 20, 100 * (this.charge / this.maxCharge), 50)

    c.strokeStyle = '#eee'
    c.strokeRect(e.width - 120, 20, 100, 50)

    c.fillStyle = '#f00'
    c.fillRect(e.mouse.x - 1, e.mouse.y - 1, 3, 3)
  }

  totalDelta = 0
  update = (e, delta) => {
    let roundTime = (Date.now() - this.roundStart) / 1000
    let d = (delta - this.totalDelta) / (1000 / 60)
    this.totalDelta = delta
    this.eventManager.update(roundTime, this.camera)
    // Charge
    if (e.mouse.down) {
      this.charge = clamp(((this.charge + 1) * d), 0, this.maxCharge)
    }
    if (this.selectedMob) {
      this.camera.centerOn(this.selectedMob.position)
    }
    this.camera.update(e, d)
    if (keys.H in e.keys) {
      this.camera.screenShake(10)
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
    this.charge = 0
  }

  keyUp (_e) {

  }

  keyEvents = {
    [keys.ONE]: _ => { this.selectedMob = this.camera.mobs[0] },
    [keys.TWO]: _ => { this.selectedMob = this.camera.mobs[1] },
    [keys.THREE]: _ => { this.selectedMob = this.camera.mobs[2] }
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
    for (let mob of lvl.mobs) {
      console.log(mob)
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
