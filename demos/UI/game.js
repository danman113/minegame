import { Scene, SceneManager } from '../../src/engine/scene'
import { rectToPolygon, pt, sum, sub } from '../../src/math'
import { Button, Container, Draggable, KeyBoardButtonManager } from '../../src/engine/UI'
import * as keys from '../../src/engine/keys'

let game = new Scene()

let sounds = 100
let music = 100

const centerButton = (margins, offset = 0) => {
  return function(e) {
    this.position.x = e.width * margins
    this.dimensions = rectToPolygon(0, 0, e.width * (1 - margins * 2), this.dimensions.verticies[2].y)
  }
}

let gameContainer = new Container({
  dimensions: rectToPolygon(0, 0, 900, 500),
  position: pt(0, 0),
})

let draggables = -1

let draggableConfig = i => ({
  position: pt(200 + (i % 4) * 200, 25 + Math.floor(i / 4) * 100),
  text: 'Draggable ' + i,
  calc: console.log(200 + (i % 4) * 200, 25 + Math.floor((i - 1) / 4) * 100),
  fontSize: 24,
  onClick: e => console.log('addItem'),
  dimensions: rectToPolygon(0, 0, 150, 75)
})

let AddItem = new Button({
  position: pt(40, 25),
  text: 'Add Item',
  fontSize: 30,
  onClick: e => gameContainer.addChildren(new Draggable(draggableConfig(++draggables))),
  dimensions: rectToPolygon(0, 0, 150, 100),
})


gameContainer.addChildren(AddItem)

const render = function (c) {
  c.clearRect(0, 0, this.width, this.height)

  gameContainer.render(c)

  c.fillStyle = '#f00'
  c.fillRect(this.mouse.x - 1, this.mouse.y - 1, 3, 3)
}

const update = function() {

  gameContainer.handleUpdate(this)
}

const keyUp = (e, key, evt) => {
}

game.render = render
game.update = update
game.onClick = e => gameContainer.handleClick(e)
game.keyUp = keyUp
export default game
