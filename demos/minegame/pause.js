import { Scene } from 'engine/scene'
import { rectToPolygon, pt } from 'math'
import { Button, Container, KeyBoardButtonManager } from 'engine/UI'
import * as keys from 'engine/keys'

let pause = new Scene()

const centerButton = (margins) => {
  return function (e) {
    this.position.x = e.width * margins
    this.dimensions = rectToPolygon(0, 0, e.width * (1 - margins * 2), this.dimensions.verticies[2].y)
  }
}

let pauseContainer = new Container({
  dimensions: rectToPolygon(0, 0, 900, 500),
  position: pt(0, 0),
})

let pauseButton = new Button({
  position: pt(40, 250),
  text: 'Resume',
  update: centerButton(0.25),
  fontSize: 50,
  onClick: _ => setTimeout(_ => pause.goto('game', true), 20),
  dimensions: rectToPolygon(0, 0, 500, 150),
})

let settingsButton = new Button({
  position: pt(40, 450),
  text: 'Main Menu',
  update: centerButton(0.25),
  onClick: _ => setTimeout(_ => pause.goto('start'), 200),
  fontSize: 50,
  dimensions: rectToPolygon(0, 0, 500, 150),
})

let keyM = new KeyBoardButtonManager({})

pause.onEnter = _ => {
  pauseContainer.children = []
  keyM.children = []
  keyM.selected = null

  keyM.addEdge(pauseButton, {
    [keys.KEY_UP]: settingsButton,
    [keys.KEY_DOWN]: settingsButton,
    [keys.ENTER]: btn => btn.onClick(),
  })

  keyM.addEdge(settingsButton, {
    [keys.KEY_UP]: pauseButton,
    [keys.KEY_DOWN]: pauseButton,
    [keys.ENTER]: btn => btn.onClick(),
  })

  // keyM.select(pauseButton)

  pauseContainer.addChildren(pauseButton, settingsButton)
}

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

  pauseContainer.render(c, e)

  c.fillStyle = '#f00'
  c.fillRect(e.mouse.x - 1, e.mouse.y - 1, 3, 3)
}

const update = function (e) {
  pauseContainer.handleUpdate(e)
  keyM.handleUpdate(e)
}

const keyUp = (e, key, evt) => {
  keyM.handleKey(e, key, evt)
  if (!keyM.selected) {
    keyM.select(keyM.children[0])
  }
}

pause.render = render
pause.update = update
pause.onClick = e => pauseContainer.handleClick(e)
pause.keyUp = keyUp
export default pause
