import { Scene, SceneManager } from '../../src/engine/scene'
import { rectToPolygon, pt } from '../../src/math'
import { Button, Container } from '../../src/engine/UI'
import * as keys from '../../src/engine/keys'

let start = new Scene()

let startContainer = new Container({
  dimensions: rectToPolygon(0, 0, 900, 500),
  position: pt(50, 2),
  render: function (c) {
    c.fillStyle = 'red'
    const rect = this.dimensions.AABB()
    c.fillRect(this.globalPosition.x, this.globalPosition.y, rect.width, rect.height)
    this.renderChildren(c)
  }
})

let startButton = new Button({
  position: pt(40, 20),
  text: 'Press ENTER to start the game',
  textAlign: 'center',
  fontSize: 30,
  dimensions: rectToPolygon(0, 0, 500, 150),
})

startContainer.addChildren(startButton)

console.log(startContainer)

const render = function (c) {
  c.clearRect(0, 0, this.width, this.height)
  
  startContainer.render(c)
  
  c.fillStyle = '#f00'
  c.fillRect(this.mouse.x - 1, this.mouse.y - 1, 3, 3)
  
  // c.fillStyle = '#fff'
  // c.font = '20px Arial,sans-serif'
  // let message = 'Press ENTER to start!'
  // let w = c.measureText(message)
  // c.fillText(message, this.width/2 - w.width/2, this.height/2)
}

const update = function() {
  if (keys.KEY_UP in this.keys) {
    startButton.fontSize++
  }

  if (keys.KEY_DOWN in this.keys) {
    startButton.fontSize--
  }
  
  startContainer.handleUpdate(this)
  console.log(startButton.state, this)
  
}

// const keyEvents = {
//   [keys.ENTER]: e => {start.goto('main')}
// }

start.render = render
start.update = update
// start.keyEvents = keyEvents
export default start
