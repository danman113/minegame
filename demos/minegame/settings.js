import { Scene } from '../../src/engine/scene'
import { rectToPolygon, pt } from '../../src/math'
import { Container, KeyBoardButtonManager, ImageButton } from '../../src/engine/UI'
import * as keys from 'engine/keys'

let settings = new Scene()
settings.state.controls = {
  UP: [keys.KEY_UP, keys.W],
  DOWN: [keys.KEY_DOWN, keys.S],
  LEFT: [keys.KEY_LEFT, keys.A],
  RIGHT: [keys.KEY_RIGHT, keys.D],
  SPRINT: [keys.SHIFT]
}

settings.state.FOV = 250
settings.state.stretchTexture = false
settings.state.music = 100
settings.state.sound = 100
settings.state.supersampling = 100

const centerButton = (margins, _offset = 0) => {
  return function (e, btn) {
    btn.position.x = e.width * margins
    btn.dimensions = rectToPolygon(0, 0, e.width * (1 - margins * 2), btn.dimensions.verticies[2].y)
  }
}

let settingsContainer = new Container({
  dimensions: rectToPolygon(0, 0, 900, 500),
  position: pt(0, 0),
})

let i = 1
const height = 125
const width = 500
const fontSize = 35
const offset = -100

let musicButton = new ImageButton({
  position: pt(40, (i++) * (height + 25) + offset),
  text: 'Music',
  update: (e, scene, btn) => {
    centerButton(0.25)(e, btn)
    btn.text = 'Music Volume: ' + (settings.state.music)
  },
  fontSize: fontSize,
  onClick: _ => {
    settings.state.music = (settings.state.music + 10) % 110
  },
  dimensions: rectToPolygon(0, 0, width, height),
})

let soundButton = new ImageButton({
  position: pt(40, (i++) * (height + 25) + offset),
  text: 'Sounds',
  onClick: _ => {
    settings.state.sound = (settings.state.sound + 10) % 110
  },
  update: (e, scene, btn) => {
    centerButton(0.25)(e, btn)
    btn.text = 'Sound Volume: ' + (settings.state.sound)
  },
  fontSize: fontSize,
  dimensions: rectToPolygon(0, 0, width, height),
})

let textureStretch = new ImageButton({
  position: pt(40, (i++) * (height + 25) + offset),
  text: 'Texture Stretch',
  onClick: _ => { settings.state.stretchTexture = !settings.state.stretchTexture },
  update: (e, scene, btn) => {
    centerButton(0.25)(e, btn)
    btn.text = 'Texture Stretch: ' + (settings.state.stretchTexture ? 'On' : 'Off')
  },
  fontSize: fontSize,
  dimensions: rectToPolygon(0, 0, width, height),
})

let superSampling = new ImageButton({
  position: pt(40, (i++) * (height + 25) + offset),
  text: 'Supersampling',
  onClick: e => {
    if (e.settings.supersampling < 1) {
      e.settings.supersampling += 0.25
    } else {
      e.settings.supersampling++
      if (e.settings.supersampling > 4) {
        e.settings.supersampling = 0.75
      }
    }
    e.setSupersampling(e.settings.supersampling)
  },
  update: (e, scene, btn) => {
    centerButton(0.25)(e, btn)
    btn.text = 'Supersampling: x' + e.settings.supersampling
  },
  fontSize: fontSize,
  dimensions: rectToPolygon(0, 0, width, height),
})

let backButton = new ImageButton({
  position: pt(40, (i++) * (height + 25) + offset),
  text: 'Back',
  update: (e, scene, btn) => { centerButton(0.25)(e, btn) },
  onClick: _ => settings.goto('start'),
  fontSize: fontSize,
  dimensions: rectToPolygon(0, 0, width, height),
})

let keyM = new KeyBoardButtonManager({})

keyM.addEdge(musicButton, {
  [keys.KEY_UP]: backButton,
  [keys.KEY_DOWN]: soundButton,
  [keys.ENTER]: btn => btn.onClick(),
})

keyM.addEdge(soundButton, {
  [keys.KEY_UP]: musicButton,
  [keys.KEY_DOWN]: textureStretch,
  [keys.ENTER]: btn => btn.onClick(),
})

keyM.addEdge(textureStretch, {
  [keys.KEY_UP]: soundButton,
  [keys.KEY_DOWN]: backButton,
  [keys.ENTER]: btn => btn.onClick(),
})

keyM.addEdge(textureStretch, {
  [keys.KEY_UP]: soundButton,
  [keys.KEY_DOWN]: superSampling,
  [keys.ENTER]: btn => btn.onClick(),
})

keyM.addEdge(superSampling, {
  [keys.KEY_UP]: textureStretch,
  [keys.KEY_DOWN]: backButton,
  [keys.ENTER]: btn => btn.onClick(),
})

keyM.addEdge(backButton, {
  [keys.KEY_UP]: superSampling,
  [keys.KEY_DOWN]: musicButton,
  [keys.ENTER]: btn => btn.onClick(),
})

settingsContainer.addChildren(musicButton, soundButton, textureStretch, superSampling, backButton)

const render = function (e, c) {
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

  settingsContainer.render(c, e)

  c.fillStyle = '#f00'
  c.fillRect(e.mouse.x - 1, e.mouse.y - 1, 3, 3)
}

const update = function (e) {
  settingsContainer.handleUpdate(e, settings)
  keyM.handleUpdate(e)
}

const keyUp = (e, key, evt) => {
  keyM.handleKey(e, key, evt)
  if (!keyM.selected) {
    keyM.select(keyM.children[0])
  }
}

settings.render = render
settings.update = update
settings.onClick = e => settingsContainer.handleClick(e)
settings.keyUp = keyUp
export default settings
