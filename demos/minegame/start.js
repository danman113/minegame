import { Scene } from 'engine/scene'
import { rectToPolygon, pt } from 'math'
import { Button, Container, KeyBoardButtonManager } from 'engine/UI'
import * as keys from 'engine/keys'

let start = new Scene()

const centerButton = (margins) => {
  return function (e) {
    this.position.x = e.width * margins
    this.dimensions = rectToPolygon(0, 0, e.width * (1 - margins * 2), this.dimensions.verticies[2].y)
  }
}

let startContainer = new Container({
  dimensions: rectToPolygon(0, 0, 900, 500),
  position: pt(0, 0),
})

let startButton = new Button({
  position: pt(40, 250),
  text: 'Start Game',
  update: centerButton(0.25),
  fontSize: 30,
  onClick: _ => start.goto('game'),
  dimensions: rectToPolygon(0, 0, 500, 150),
})

let settingsButton = new Button({
  position: pt(40, 450),
  text: 'Settings',
  update: centerButton(0.25),
  onClick: _ => start.goto('settings'),
  fontSize: 30,
  dimensions: rectToPolygon(0, 0, 500, 150),
})

let keyM = new KeyBoardButtonManager({})

keyM.addEdge(startButton, {
  [keys.KEY_UP]: settingsButton,
  [keys.KEY_DOWN]: settingsButton,
  [keys.ENTER]: btn => btn.onClick(),
})

keyM.addEdge(settingsButton, {
  [keys.KEY_UP]: startButton,
  [keys.KEY_DOWN]: startButton,
  [keys.ENTER]: btn => btn.onClick(),
})

// keyM.select(startButton)

startContainer.addChildren(startButton, settingsButton)

console.log(startContainer)

const render = function (c) {
  c.clearRect(0, 0, this.width, this.height)

  startContainer.render(c)

  c.fillStyle = '#f00'
  c.fillRect(this.mouse.x - 1, this.mouse.y - 1, 3, 3)
}

const update = function () {
  startContainer.handleUpdate(this)
  keyM.handleUpdate(this)
}

const keyUp = (e, key, evt) => {
  keyM.handleKey(e, key, evt)
  if (!keyM.selected) {
    keyM.select(keyM.children[0])
  }
}

start.render = render
start.update = update
start.onClick = e => startContainer.handleClick(e)
start.keyUp = keyUp
export default start
