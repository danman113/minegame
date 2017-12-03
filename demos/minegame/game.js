import { Scene } from 'engine/scene'
import { pt, Circle } from 'math'
// import { lerp } from 'math/animation'
// import { Button, Container, Draggable, KeyBoardButtonManager } from 'engine/UI'
import * as keys from 'engine/keys'
import Camera from './components/camera'
import Settings from './settings'
import { Mob } from './components/mob'
import { loadTiled } from './components/levelparser'
import { Projectile, BasicMine } from './components/projectile'
import { moveTo } from './components/ai'
import TestLevel from './assets/testlevel.json'

let {
  UP,
  DOWN,
  LEFT,
  RIGHT
} = Settings.state.controls

const makeMine = (x, y) =>
  new BasicMine(pt(x, y))

const screenShake = (camera, amount) => {
  camera.position.x += (Math.random() - 0.5) * amount
  camera.position.y += (Math.random() - 0.5) * amount
}

let game = new Scene()

const actionInKeys = (action, keys) => {
  for (let key of action) {
    if (key in keys) {
      return true
    }
  }
  return false
}

const playerUpdate = (mob, e, _camera, d) => {
  if (actionInKeys(UP, e.keys)) {
    selectedMob.translate(0, -1 * d, camera)
  }
  if (actionInKeys(DOWN, e.keys)) {
    selectedMob.translate(0, 1 * d, camera)
  }
  if (actionInKeys(LEFT, e.keys)) {
    selectedMob.translate(-1 * d, 0, camera)
  }
  if (actionInKeys(RIGHT, e.keys)) {
    selectedMob.translate(1 * d, 0, camera)
  }
}

let camera = new Camera()
const player = new Mob(new Circle(pt(50, 50), 15), playerUpdate)
global.player = player

let enemyUpdate = (mob, e, _camera, d) => {
  let coords = moveTo(mob, player.position)
  mob.translate(coords.x * d, coords.y * d, camera)
}

const enemy = new Mob(new Circle(pt(100, 500), 20), enemyUpdate)
camera.addMob(player, enemy)

console.log('Load Tiled')
let testLevel = loadTiled(TestLevel)
console.log(testLevel)
for (let geom of testLevel.geometry) {
  camera.geometry.push(geom)
}

global.camera = camera

const render = function (c) {
  // let e = this
  // let d = 1
  global.c = c
  c.clearRect(0, 0, this.width, this.height)

  camera.render(c, this)

  c.fillStyle = '#f00'
  c.fillRect(this.mouse.x - 1, this.mouse.y - 1, 3, 3)
}

let selectedMob = camera.mobs[0]
let totalDelta = 0
const update = function (e, delta) {
  let d = (delta - totalDelta) / (1000 / 60)
  totalDelta = delta
  camera.centerOn(selectedMob.position)
  camera.update(e, d)
  if (keys.H in e.keys) {
    screenShake(camera, 10)
  }
}

const keyUp = (_e, _key, _evt) => {
}

const onClick = (e) => {
  let x = e.mouse.x + -camera.position.x
  let y = e.mouse.y + -camera.position.y
  console.log(x, y)
  let mine = makeMine(x, y)
  camera.projectiles.push(mine)
}

const keyEvents = {
  [keys.ONE]: _ => { selectedMob = camera.mobs[0] },
  [keys.TWO]: _ => { selectedMob = camera.mobs[1] },
  [keys.THREE]: _ => { selectedMob = camera.mobs[2] }
}

game.render = render
game.update = update
game.onClick = onClick
game.keyUp = keyUp
game.keyEvents = keyEvents
export default game
