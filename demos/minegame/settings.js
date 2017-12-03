import { Scene, SceneManager } from '../../src/engine/scene'
import { rectToPolygon, pt, sum, sub } from '../../src/math'
import { Button, Container, Draggable, KeyBoardButtonManager } from '../../src/engine/UI'
import * as keys from 'engine/keys'

let settings = new Scene()
settings.state.controls = {
  UP: [keys.KEY_UP, keys.W],
  DOWN: [keys.KEY_DOWN, keys.S],
  LEFT: [keys.KEY_LEFT, keys.A],
  RIGHT: [keys.KEY_RIGHT, keys.D],
  SPRINT: [keys.SHIFT]
}

let sounds = 100
let music = 100

const centerButton = (margins, offset = 0) => {
  return function(e) {
    this.position.x = e.width * margins
    this.dimensions = rectToPolygon(0, 0, e.width * (1 - margins * 2), this.dimensions.verticies[2].y)
  }
}

let settingsContainer = new Container({
  dimensions: rectToPolygon(0, 0, 900, 500),
  position: pt(0, 0),
})

let musicButton = new Button({
  position: pt(40, 250),
  text: 'Music',
  update: centerButton(0.25),
  fontSize: 30,
  onClick: e => alert('In progress'),
  dimensions: rectToPolygon(0, 0, 500, 150),
})

let soundButton = new Button({
  position: pt(40, 450),
  text: 'Sounds',
  onClick: _ => alert('In progress'),
  update: centerButton(0.25),
  fontSize: 30,
  dimensions: rectToPolygon(0, 0, 500, 150),
})

let backButton = new Button({
  position: pt(40, 650),
  text: 'Back',
  update: centerButton(0.25),
  onClick: _ => settings.goto('start'),
  fontSize: 30,
  dimensions: rectToPolygon(0, 0, 500, 150),
})

let keyM = new KeyBoardButtonManager({})

keyM.addEdge(musicButton, {
  [keys.KEY_UP]: backButton,
  [keys.KEY_DOWN]: soundButton,
  [keys.ENTER]: btn => btn.onClick(),
})

keyM.addEdge(soundButton, {
  [keys.KEY_UP]: musicButton,
  [keys.KEY_DOWN]: backButton,
  [keys.ENTER]: btn => btn.onClick(),
})

keyM.addEdge(backButton, {
  [keys.KEY_UP]: soundButton,
  [keys.KEY_DOWN]: musicButton,
  [keys.ENTER]: btn => btn.onClick(),
})

settingsContainer.addChildren(musicButton, soundButton, backButton)

const render = function (c) {
  c.clearRect(0, 0, this.width, this.height)

  settingsContainer.render(c)

  c.fillStyle = '#f00'
  c.fillRect(this.mouse.x - 1, this.mouse.y - 1, 3, 3)
}

const update = function() {

  settingsContainer.handleUpdate(this)
  keyM.handleUpdate(this)
}

const keyUp = (e, key, evt) => {
  keyM.handleKey(e, key, evt)
  if (!keyM.selected) {
    keyM.select(keyM.children[0])
  }
}

settings.render = render
settings.update = update
settings.onClick = e => settingsContainer.handleClick(e)
settings.keyUp = keyUp
export default settings
