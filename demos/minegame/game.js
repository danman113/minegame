import { Scene } from 'engine/scene'
import { rectToPolygon, pt, sum, sub } from 'math'
// import { lerp } from 'math/animation'
// import { Button, Container, Draggable, KeyBoardButtonManager } from 'engine/UI'
import * as keys from 'engine/keys'
import Camera from './components/camera'
import Settings from './settings'
import { Mob } from './components/mob'

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
camera.addMob(new Mob(pt(50, 50)))
camera.addMob(new Mob(pt(100, 500)))

global.camera = camera

const render = function (c) {
  c.clearRect(0, 0, this.width, this.height)

  camera.render(c, this)

  c.fillStyle = '#f00'
  c.fillRect(this.mouse.x - 1, this.mouse.y - 1, 3, 3)
}
let selectedMob = camera.mobs[0]
const update = function (e, delta) {
  camera.centerOn(selectedMob.position)
  if (actionInKeys(UP, e.keys)) {
    selectedMob.position.y -= 1 * delta
  }
  if (actionInKeys(DOWN, e.keys)) {
    selectedMob.position.y += 1 * delta
  }
  if (actionInKeys(LEFT, e.keys)) {
    selectedMob.position.x -= 1 * delta
  }
  if (actionInKeys(RIGHT, e.keys)) {
    selectedMob.position.x += 1 * delta
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
