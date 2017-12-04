import { isNode, DocumentMock, WindowMock } from '../../src/engine/isomorphic-helpers'
import { SceneManager } from '../../src/engine/scene'
import Engine from '../../src/engine'

import loading from './loading'
import start from './start'
import settings from './settings'
import game from './game'
import levelSelect from './levelselect'
import pause from './pause'

if (isNode()) {
  global.document = new DocumentMock()
  global.window = new WindowMock()
  console.log('isNode')
} else {
  console.log('isBrowser')
}

let engine = new Engine(document.getElementById('canvas'), 640, 480, true)

let scenes = {
  loading,
  start,
  settings,
  game,
  levelSelect,
  pause
}

console.log('Loaded scenes')
console.log(scenes)

let manager = new SceneManager(engine, scenes)
manager.goto('loading')
engine.start()
