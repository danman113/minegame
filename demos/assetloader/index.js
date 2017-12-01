import { pt, Polygon, ccw, angle3, Line, Segment, Ray } from '../../src/math'
import { drawPolygon, drawLine, drawSegment, drawRay } from '../../src/engine/renderer'
import * as KEYS from '../../src/engine/keys'
import { isNode, DocumentMock, WindowMock } from '../../src/engine/isomorphic-helpers'
import Engine from '../../src/engine'
import { ImageLoader, AudioLoader } from 'engine/loaders'

if (isNode()) {
  global.document = new DocumentMock()
  global.window = new WindowMock()
  console.log('isNode')
} else {
  console.log('isBrowser')
}

let loader = new ImageLoader({
  cat: 'https://i.redditmedia.com/VQiowSHB8Ny5Cs513cn7rwyrfwMbLL0m--N9E0vTybU.jpg?w=576&s=6f6cb8532b74e563b08d1becb5e84dab',
  piggu: 'https://i.redd.it/4rb3pv4dg6101.jpg',
  duck: 'https://i.redditmedia.com/7Ghl3ZleOSANlrx6M9MjwY_kZPB28P25I69Kz9RAwbo.jpg?w=768&s=6c40732694364a98dae5c204c7d1443c',
  bluesnek: 'https://i.redditmedia.com/qCA4u9-Kw-gFFags38Jz05bGp28dR1Y_GErP2VAiXrU.jpg?w=680&s=44457e27c5b9afe22b4fe6f5a8418e3c',
  fancy: 'https://i.redditmedia.com/sC7JbThUeuWrQfFhaBRpc6JxoOnXP0nmYs9w_2_tfK0.jpg?w=975&s=2333394942704c68e5953011b3918a7e',
  sweater: 'https://i.redditmedia.com/IRPCJ2pSc6iysWKo1hrztnkV8pRFeeb4j3wI4lEmYZI.jpg?w=540&s=a62d300b11a891c74402558782e9d464',
  strawberry: 'https://i.redditmedia.com/rIi6dGesa1IIpKyiPy4zXIdV2cml5Bs4y3GAF3OXAis.jpg?w=640&s=93e9526e4c3748bfe5601202835eccfc'
})

let audio = new AudioLoader({
  salad: 'test.mp3'
})

setTimeout(_ => {
  console.log(audio.assets.salad)
  audio.assets.salad.play()
}, 8000)

let engine = new Engine(document.getElementById('canvas'), 640, 480, true)
engine.draw = function (c) {
  c.clearRect(0, 0, this.width, this.height)
  let i = 0
  if (loader.loaded >= loader.total) {
    for (let name in loader.images) {
      let img = loader.images[name]
      if (img.loaded) {
        const aspectRatio = img.height / img.width
        c.drawImage(img, (((this.width - 20 * 5) / 5) + 20) * (i % 5), Math.floor(i / 5) * 175, ((this.width - 20 * 5) / 5), aspectRatio * 150)
        i++
      }
    }
  } else {
    c.fillStyle = 'white'
    c.font = '40px sans-serif'
    c.fillText(`${loader.loaded} / ${loader.total} Images Loaded`, this.width / 2, this.height / 2)
  }
  console.log(audio.loaded)
}
engine.start()
