import { Scene, SceneManager } from '../../src/engine/scene'
import * as keys from '../../src/engine/keys'

let settings = new Scene()

const MenuItems = [
  {
    name: 'Audio',
    value: 100,
    left: item => {
      item.value -= 10
      if (item.value < 0) {
        item.value = 100
      }
    },
    right: item => {
      item.value = ((item.value + 10) % 110)
    },
    func: e => e.right(e)
  },
  {
    name: 'Sound Effects',
    value: 100,
    left: item => {
      item.value -= 10
      if (item.value < 0) {
        item.value = 100
      }
    },
    right: item => {
      item.value = ((item.value + 10) % 110)
    },
    func: e => e.right(e) 
  },
  {
    name: 'Keybindings',
    func: _ => alert('Keybindings go here. Too lazy')
  },
  {
    name: 'Exit',
    func: _ => settings.goto('main')
  }
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
    let text = item.name + (item.value!== undefined? ': ' + item.value:'')
    let w = c.measureText(text)
    c.fillText(text, this.width/2 - w.width/2, this.height/4 + i * 30)
    if (i === ItemIterator) {
      c.fillText('>', this.width/2 - w.width/2 - 30, this.height/4 + ItemIterator * 30)
    }
    i++
  }
}

const keyEvents = {
  [keys.ENTER]: _ => {MenuItems[ItemIterator].func(MenuItems[ItemIterator])},
  [keys.KEY_DOWN]: _ => {ItemIterator = (++ItemIterator)%MenuItems.length},
  [keys.KEY_UP]: _ => {ItemIterator = (--ItemIterator)<0?MenuItems.length - 1:ItemIterator},
  [keys.KEY_LEFT]: _ => {
    let item = MenuItems[ItemIterator]
    if (item.left) {
      item.left(item)
    }
  },
  [keys.KEY_RIGHT]: _ => {
    let item = MenuItems[ItemIterator]
    if (item.right) {
      item.right(item)
    }
  },
  
}

settings.render = render
settings.onEnter = onEnter
settings.keyEvents = keyEvents
export default settings
