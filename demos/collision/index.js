import { pt, Polygon, angle3, Line, Segment, Ray, distance, angle2, radToDeg, degToRad } from '../../src/math'
import { drawPolygon, drawLine, drawSegment, drawRay } from '../../src/engine/renderer'
import { importTiledMap } from '../../src/engine/importers'
import * as KEYS from '../../src/engine/keys'
import { isNode, DocumentMock, WindowMock } from '../../src/engine/isomorphic-helpers'
import Engine from '../../src/engine'
import Collidable from './collision'

import tileMapData from './sightnlight.json'

let tileMap = importTiledMap(tileMapData)

if (isNode()) {
  global.document = new DocumentMock()
  global.window = new WindowMock()
  console.log('isNode')
} else {
  console.log('isBrowser')
}

let engine = new Engine(document.getElementById('canvas'))

let visibilityPolygon = new Polygon(pt(250, 250), pt(20,20), pt(20, 20))
let polyQueue = []
let collidables = []

let boxes = true

const clk = _ => {
  
}

for (let layerNames in tileMap) {
  let layer = tileMap[layerNames]
  polyQueue.push(...layer)
}

for (let poly of polyQueue) {
  collidables.push(new Collidable(poly))
}

let player = new Polygon(pt(347, 79), pt(291, 69), pt(278, 126), pt(328, 133))
player.translate(-25, 0)
let playerCollider = new Collidable(player)
polyQueue.push(player)

engine.keyEvents[KEYS.H] = _ => {
  boxes = !boxes
}


const update = function (delta) {
  
  const collisionSpeed = 0.25
  
  if (KEYS.KEY_UP in this.keys) {
    let ty = -2
    if(!playerCollider.translate(0, ty, collidables)) {
      let steps = 10
      for(let i = 0; i < steps; i++) {
        let dy = (collisionSpeed/steps)
        playerCollider.translate(dy* -1, 0, collidables)
        playerCollider.translate(0, dy * ty, collidables)
      }
      for(let i = 0; i < steps; i++) {
        let dy = (collisionSpeed/steps)
        playerCollider.translate(dy * 1, 0, collidables)
        playerCollider.translate(0, dy * ty, collidables)
      }
    }
  }
  if (KEYS.KEY_DOWN in this.keys) {
    let ty = 2
    if(!playerCollider.translate(0, ty, collidables)) {
      let steps = 10
      for(let i = 0; i < steps; i++) {
        let dy = (collisionSpeed/steps)
        playerCollider.translate(dy* -1, 0, collidables)
        playerCollider.translate(0, dy * ty, collidables)
      }
      for(let i = 0; i < steps; i++) {
        let dy = (collisionSpeed/steps)
        playerCollider.translate(dy * 1, 0, collidables)
        playerCollider.translate(0, dy * ty, collidables)
      }
    }
  }
  if (KEYS.KEY_LEFT in this.keys) {
    let tx = -2
    if(!playerCollider.translate(tx, 0, collidables)) {
      let steps = 10
      for(let i = 0; i < steps; i++) {
        let dy = (collisionSpeed/steps)
        playerCollider.translate(0, dy* -1, collidables)
        playerCollider.translate(dy * tx, 0 , collidables)
      }
      for(let i = 0; i < steps; i++) {
        let dy = (collisionSpeed/steps)
        playerCollider.translate(0, dy * 1, collidables)
        playerCollider.translate(dy * tx, 0, collidables)
      }
    }
  }
  if (KEYS.KEY_RIGHT in this.keys) {
    let tx = 2
    if(!playerCollider.translate(tx, 0, collidables)) {
      let steps = 10
      for(let i = 0; i < steps; i++) {
        let dy = (collisionSpeed/steps)
        playerCollider.translate(0, dy* -1, collidables)
        playerCollider.translate(dy * tx, 0 , collidables)
      }
      for(let i = 0; i < steps; i++) {
        let dy = (collisionSpeed/steps)
        playerCollider.translate(0, dy * 1, collidables)
        playerCollider.translate(dy * tx, 0, collidables)
      }
    }
  }
  
  if (KEYS.Q in this.keys) {
    playerCollider.rotate(1, collidables)
  }
  if (KEYS.E in this.keys) {
    playerCollider.rotate(-1, collidables)
  }
}

const draw = function (c) {
  c.clearRect(0, 0, 500, 500)
  
  for (let i = 0; i < polyQueue.length; i++) {
    let poly = polyQueue[i]
    drawPolygon(c, poly, 'green', 'blue', boxes)
  }
}

engine.draw = draw
engine.update = update
engine.onClick = clk
engine.start()
