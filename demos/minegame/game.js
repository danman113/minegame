import { Scene } from 'engine/scene'
import { rectToPolygon, pt, sum, sub, Circle } from 'math'
// import { lerp } from 'math/animation'
// import { Button, Container, Draggable, KeyBoardButtonManager } from 'engine/UI'
import * as keys from 'engine/keys'
import Camera from './components/camera'
import Settings from './settings'
import { Mob } from './components/mob'
import { loadTiled } from './components/levelparser'
import TestLevel from './assets/testlevel.json'

const screenShake = (camera, amount) => {
  camera.position.x += (Math.random() - 0.5) * amount
  camera.position.y += (Math.random() - 0.5) * amount
}

let game = new Scene()

let {
  UP,
  DOWN,
  LEFT,
  RIGHT
} = Settings.state.controls

const actionInKeys = (action, keys) => {
  for (let key of action) {
    if (key in keys) {
      return true
    }
  }
  return false
}

let camera = new Camera()
const player = new Mob(new Circle(pt(50, 50), 10))
const enemy = new Mob(new Circle(pt(100, 500), 20))
camera.addMob(player, enemy)

console.log('Load Tiled')
let testLevel = loadTiled(TestLevel)
console.log(testLevel)
for (let geom of testLevel.geometry) {
  camera.geometry.push(geom)
}

global.camera = camera

const render = function (c) {
  let e = this
  let d = 1
  global.c = c
  c.clearRect(0, 0, this.width, this.height)

  camera.render(c, this)

  if (actionInKeys(UP, e.keys)) {
    selectedMob.translate(0, -1 * d, camera.mobs, camera.geometry)
  }
  if (actionInKeys(DOWN, e.keys)) {
    selectedMob.translate(0, 1 * d, camera.mobs, camera.geometry)
  }
  if (actionInKeys(LEFT, e.keys)) {
    selectedMob.translate(-1 * d, 0, camera.mobs, camera.geometry)
  }
  if (actionInKeys(RIGHT, e.keys)) {
    selectedMob.translate(1 * d, 0, camera.mobs, camera.geometry)
  }

  c.fillStyle = '#f00'
  c.fillRect(this.mouse.x - 1, this.mouse.y - 1, 3, 3)
}
let selectedMob = camera.mobs[0]
let totalDelta = 0
const update = function (e, delta) {
  let d = (delta - totalDelta) / (1000 / 60)
  totalDelta = delta
  camera.centerOn(selectedMob.position)
  if (actionInKeys(UP, e.keys)) {
    selectedMob.translate(0, -1 * d, camera.mobs, camera.geometry)
  }
  if (actionInKeys(DOWN, e.keys)) {
    selectedMob.translate(0, 1 * d, camera.mobs, camera.geometry)
  }
  if (actionInKeys(LEFT, e.keys)) {
    selectedMob.translate(-1 * d, 0, camera.mobs, camera.geometry)
  }
  if (actionInKeys(RIGHT, e.keys)) {
    selectedMob.translate(1 * d, 0, camera.mobs, camera.geometry)
  }

  if (keys.H in e.keys) {
    screenShake(camera, 10)
  }
}

const keyUp = (_e, _key, _evt) => {
}

const keyEvents = {
  [keys.ONE]: _ => { selectedMob = camera.mobs[0] },
  [keys.TWO]: _ => { selectedMob = camera.mobs[1] },
  [keys.THREE]: _ => { selectedMob = camera.mobs[2] }
}

game.render = render
game.update = update
game.onClick = _ => {}
game.keyUp = keyUp
game.keyEvents = keyEvents
export default game
