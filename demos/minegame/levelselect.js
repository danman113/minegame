import { Scene } from 'engine/scene'
import { rectToPolygon, pt } from 'math'
import { Button, Container, KeyBoardButtonManager, ImageButton } from 'engine/UI'
import * as keys from 'engine/keys'
import game from './game'

let levelSelect = new Scene()
levelSelect.onEnter = _ => {
  // alert(game.state.currentLevel)
}

const centerButton = (margins) => {
  return function (e) {
    this.position.x = e.width * margins
  }
}

let levelSelectContainer = new Container({
  dimensions: rectToPolygon(0, 0, 900, 500),
  position: pt(0, 0),
})

const levels = {
  test: 'Test Level',
  level1: 'Level 1',
  level2: 'Level 2',
  level3: 'Level 3',
  level4: 'Level 4',
  level5: 'Level 5',
}

let keyM = new KeyBoardButtonManager({})

let i = 0
let height = 100
let padding = 25
for (let cl in levels) {
  let btn = new ImageButton({
    position: pt(40, 100 + i * height + i * padding),
    text: levels[cl],
    update: centerButton(0.1),
    fontSize: 50,
    onClick: _ => {
      game.state.currentLevel = cl
      levelSelect.goto('game')
    },
    dimensions: rectToPolygon(0, 0, 300, height),
  })
  levelSelectContainer.addChildren(btn)
  let topButton = null
  let bottomButton = null
  if (i === 0) {
    topButton = btn
    bottomButton = btn
  } else {
    levelSelectContainer.children[i - 1].buttons[keys.KEY_DOWN] = btn
    levelSelectContainer.children[0].buttons[keys.KEY_UP] = btn
    topButton = levelSelectContainer.children[i - 1]
    bottomButton = levelSelectContainer.children[0]
  }
  keyM.addEdge(btn, {
    [keys.KEY_UP]: topButton,
    [keys.KEY_DOWN]: bottomButton,
    [keys.ENTER]: btn => btn.onClick(),
  })
  i++
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

  levelSelectContainer.render(c, e)

  c.fillStyle = '#f00'
  c.fillRect(e.mouse.x - 1, e.mouse.y - 1, 3, 3)
}

const update = function (e) {
  levelSelectContainer.handleUpdate(e)
  keyM.handleUpdate(e)
}

const keyUp = (e, key, evt) => {
  keyM.handleKey(e, key, evt)
  if (!keyM.selected) {
    keyM.select(keyM.children[0])
  }
}

levelSelect.render = render
levelSelect.update = update
levelSelect.onClick = e => levelSelectContainer.handleClick(e)
levelSelect.keyUp = keyUp
export default levelSelect
