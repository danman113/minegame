import { pt, Polygon, ccw, angle3, Line, Segment, Ray } from '../../src/math'
import { drawPolygon } from '../../src/engine/renderer'
import { importTiledMap, makeFileImporter } from '../../src/engine/importers'
import * as KEYS from '../../src/engine/keys'
import { isNode, DocumentMock, WindowMock } from '../../src/engine/isomorphic-helpers'
import Engine from '../../src/engine'

import tileMapJson from './tilemap.json'

let tileMap = importTiledMap(tileMapJson)

makeFileImporter(document.getElementById('container'), (err, json) => {
  if(err) {
    alert(err)
    return
  }
  console.log(json)
  tileMap = importTiledMap(json)
})

console.log(tileMapJson, tileMap)

if (isNode()) {
  global.document = new DocumentMock()
  global.window = new WindowMock()
  console.log('isNode')
} else {
  console.log('isBrowser')
}

let engine = new Engine(document.getElementById('canvas'))

let c = document.getElementById('canvas').getContext('2d')

const clk = function () {
}

const update = function (delta) {
  // console.log(this.keys)
}

const draw = function (c) {
  let mouse = pt(this.mouse.x, this.mouse.y)
  c.clearRect(0, 0, 500, 500)
  c.fillStyle = 'red'
  c.fillRect(this.mouse.x - 1, this.mouse.y - 1, 3, 3)
  for(let layer in tileMap) {
    tileMap[layer].map(poly => {
      if(poly.verticies)
        drawPolygon(c, poly, 'green')
    })
  }
}

engine.draw = draw
engine.update = update
engine.onClick = clk
engine.start()
