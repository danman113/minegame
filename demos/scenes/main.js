import { Scene, SceneManager } from '../../src/engine/scene'
import * as keys from '../../src/engine/keys'

let main = new Scene()

let newGame = false

const MenuItems = [
  {name: 'Continue', func: _ => {newGame?main.goto('game', true):alert('No game found. Please start a new game!')}},
  {name: 'New Game', func: _ => { newGame = true;main.goto('game') }},
  {name: 'Settings', func: _ => main.goto('settings')},
  {name: 'Exit', func: _ => main.goto('start')}
]

let ItemIterator = 0

const onEnter = _ => {
  ItemIterator = 0
}

const render = function (c) {
  c.clearRect(0, 0, this.width, this.height)
  
  c.fillStyle = '#f00'
  c.fillRect(this.mouse.x - 1, this.mouse.y - 1, 3, 3)
  
  c.fillStyle = '#fff'
  c.font = '20px Arial,sans-serif'
  let i = 0
  for(let item of MenuItems) {
    let w = c.measureText(item.name)
    c.fillText(item.name, this.width/2 - w.width/2, this.height/4 + i * 30)
    if (i === ItemIterator) {
      c.fillText('>', this.width/2 - w.width/2 - 30, this.height/4 + ItemIterator * 30)
    }
    i++
  }
}

const keyEvents = {
  [keys.ENTER]: _ => {MenuItems[ItemIterator].func()},
  [keys.KEY_DOWN]: _ => {ItemIterator = (++ItemIterator)%MenuItems.length},
  [keys.KEY_UP]: _ => {ItemIterator = (--ItemIterator)<0?MenuItems.length - 1:ItemIterator}
}

main.render = render
main.onEnter = onEnter
main.keyEvents = keyEvents
export default main
