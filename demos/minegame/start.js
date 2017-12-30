import { Scene } from 'engine/scene'
import { rectToPolygon, pt } from 'math'
import { Container, KeyBoardButtonManager, ImageButton } from 'engine/UI'
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

let startButton = new ImageButton({
  position: pt(40, 250),
  text: 'Start Game',
  update: centerButton(0.25),
  fontSize: 50,
  onClick: _ => start.goto('levelSelect'),
  dimensions: rectToPolygon(0, 0, 500, 150),
})

let settingsButton = new ImageButton({
  position: pt(40, 450),
  text: 'Settings',
  update: centerButton(0.25),
  onClick: _ => start.goto('settings'),
  fontSize: 50,
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

const render = (e, c) => {
  c.clearRect(0, 0, e.width, e.height)

  let bgimg = e.state.imageLoader.images.floor2
  let tileSize = 512
  let x = Math.ceil(e.width / tileSize) + 1
  let y = Math.ceil(e.height / tileSize) + 1
  for (let i = 0; i < x; i++) {
    for (let j = 0; j < y; j++) {
      c.drawImage(
        bgimg,
        i * tileSize, j * tileSize,
        tileSize, tileSize
      )
    }
  }

  startContainer.render(c, e)

  c.font = '75px MTV2C'
  c.fillStyle = `white`
  let text = 'Mine Games'
  let w = c.measureText(text)
  c.fillText(text, e.width / 2 - w.width / 2, 150)

  c.fillStyle = '#f00'
  c.fillRect(e.mouse.x - 25, e.mouse.y - 25, 51, 51)
}

const update = function (e) {
  startContainer.handleUpdate(e)
  keyM.handleUpdate(e)
}

const keyUp = (e, key, evt) => {
  keyM.handleKey(e, key, evt)
  if (!keyM.selected) {
    keyM.select(keyM.children[0])
  }
}

start.render = render
start.update = update
start.onClick = e => { startContainer.handleClick(e); console.log('CLICKED', e) }
start.keyUp = keyUp
export default start
