import { Scene, SceneManager } from '../../src/engine/scene'
import { rectToPolygon, pt, sum, sub } from '../../src/math'
import { Button, Container, Draggable, KeyBoardButtonManager } from '../../src/engine/UI'
import * as keys from '../../src/engine/keys'

let game = new Scene()

const render = function (c) {
  c.clearRect(0, 0, this.width, this.height)

  c.fillStyle = '#f00'
  c.fillRect(this.mouse.x - 1, this.mouse.y - 1, 3, 3)
}

const update = function (_e, _delta) {

}

const keyUp = (_e, _key, _evt) => {
}

game.render = render
game.update = update
game.onClick = _ => {}
game.keyUp = keyUp
export default game
