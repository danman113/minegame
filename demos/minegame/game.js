import { Scene } from 'engine/scene'
import { pt, Circle, sub, sum, clamp } from 'math'
// import { lerp } from 'math/animation'
// import { Button, Container, Draggable, KeyBoardButtonManager } from 'engine/UI'
import * as keys from 'engine/keys'
import Camera from './components/camera'
import { Mob, BasicEnemy } from './components/mob'
import Player from './components/player'
import { loadTiled } from './components/levelparser'
import { Projectile, BasicMine } from './components/projectile'
import { moveTo } from './components/ai'
import TestLevel from './assets/testlevel.json'

const screenShake = (camera, amount) => {
  camera.position.x += (Math.random() - 0.5) * amount
  camera.position.y += (Math.random() - 0.5) * amount
}

let game = new Scene()

let camera = new Camera()
const player = new Player(50, 50)
global.player = player

const throwMine = (x, y) => {
  let direction = sub(pt(x, y), player.position)
  return new BasicMine(player.position, direction, 5 + (charge / maxCharge) * 15)
}

// let enemyUpdate = (mob, e, _camera, d) => {
//   let coords = moveTo(mob, player.position)
//   mob.translate(coords.x * d, coords.y * d, camera)
// }

const enemy = new BasicEnemy(100, 500)
camera.addMob(player, enemy)

console.log('Load Tiled')
let testLevel = loadTiled(TestLevel)
console.log(testLevel)
for (let geom of testLevel.geometry) {
  camera.geometry.push(geom)
}

let selectedMob = camera.mobs[0]
let charge = 0
let maxCharge = 60

global.camera = camera

const render = function (c) {
  // let e = this
  // let d = 1
  global.c = c
  c.clearRect(0, 0, this.width, this.height)

  camera.render(c, this)

  c.fillStyle = '#d1e207'
  c.fillRect(this.width - 120, 0, 100 * (charge / maxCharge), 50)

  c.strokeStyle = '#eee'
  c.strokeRect(this.width - 120, 0, 100, 50)

  c.fillStyle = '#f00'
  c.fillRect(this.mouse.x - 1, this.mouse.y - 1, 3, 3)
}

let totalDelta = 0
const update = function (e, delta) {
  let d = (delta - totalDelta) / (1000 / 60)
  totalDelta = delta
  if (e.mouse.down) {
    charge = clamp(((charge + 1) * d), 0, maxCharge)
  }
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
  let mine = throwMine(x, y, charge)
  camera.projectiles.push(mine)
  charge = 0
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
