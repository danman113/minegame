import { Scene, SceneManager } from '../../src/engine/scene'
import * as keys from '../../src/engine/keys'

let start = new Scene()

const render = function (c) {
  c.clearRect(0, 0, this.width, this.height)
  
  c.fillStyle = '#f00'
  c.fillRect(this.mouse.x - 1, this.mouse.y - 1, 3, 3)
  
  c.fillStyle = '#fff'
  c.font = '20px Arial,sans-serif'
  let message = 'Press ENTER to start!'
  let w = c.measureText(message)
  c.fillText(message, this.width/2 - w.width/2, this.height/2)
}

const keyEvents = {
  [keys.ENTER]: e => {start.goto('main')}
}

start.render = render
start.keyEvents = keyEvents
export default start
