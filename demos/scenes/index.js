import { pt, Polygon, ccw, angle3, Line, Segment, Ray } from '../../src/math'
import { drawPolygon, drawLine, drawSegment, drawRay } from '../../src/engine/renderer'
import * as KEYS from '../../src/engine/keys'
import { isNode, DocumentMock, WindowMock } from '../../src/engine/isomorphic-helpers'
import { Scene, SceneManager } from '../../src/engine/scene'
import Engine from '../../src/engine'

import start from './start'
import main from './main'
import settings from './settings'
import game from './game'

if (isNode()) {
  global.document = new DocumentMock()
  global.window = new WindowMock()
  console.log('isNode')
} else {
  console.log('isBrowser')
}

let engine = new Engine(document.getElementById('canvas'), 640, 480, true)

let scenes = {
  start,
  main,
  settings,
  game
}

console.log('Loaded scenes')
console.log(scenes)

let manager = new SceneManager(engine, scenes)
manager.goto('start')
engine.start()
