import { isNode, DocumentMock, WindowMock } from 'engine/isomorphic-helpers'
import { drawPolygon } from 'engine/renderer'
import NavMesh, { MineNavMesh, AStarNavMesh, GridStarNavMesh } from './navmesh'
import * as keys from 'engine/keys'
import Engine from 'engine'
import { Polygon, pt } from 'math'

const timeit = (
  name = `Function ${Math.floor(Math.random() * 0xfffff)}`,
  func = _ => {},
  iterations = 100
) => {
  console.time(name)
  for (let i = 0; i < iterations; i++) {
    func()
  }
  console.timeEnd(name)
}

if (isNode()) {
  global.document = new DocumentMock()
  global.window = new WindowMock()
  console.log('isNode')
} else {
  console.log('isBrowser')
}

let engine = new Engine(document.getElementById('canvas'), 1024, 720, false)

let poly = new Polygon(pt(0, 0), pt(100, 0), pt(100, 120))
poly.translate(140, 140)
let geometry = [poly]
let points = []
let navmesh = new NavMesh()

let settings = {
  points: true,
  segments: true,
  path: true
}

const render = (e, c) => {
  c.clearRect(0, 0, e.width, e.height)
  for (let geom of geometry) {
    drawPolygon(c, geom)
  }
  if (points.length > 1) {
    let g = new Polygon(...points, pt(e.mouse.x, e.mouse.y))
    drawPolygon(c, g, 'blue')
  } else if (points.length === 1) {
    c.fillStyle = 'red'
    c.fillRect(points[0].x - 1, points[0].y - 1, 3, 3)
  }
  navmesh.render(c, e, settings)
}

const update = (_e) => {}

const click = e => {
  let nearestPoint = null
  if (navmesh) {
    nearestPoint = navmesh.getNearestPoint(e.mouse)
  }

  if (keys.CTRL in e.keys) {
    navmesh.dest = nearestPoint
    navmesh.path = navmesh.search(navmesh.src, navmesh.dest)
  } else if (keys.SHIFT in e.keys) {
    navmesh.src = nearestPoint
    navmesh.path = navmesh.search(navmesh.src, navmesh.dest)
  } else {
    points.push(pt(e.mouse.x, e.mouse.y))
  }
}

const keyEvents = {
  [keys.ENTER]: _ => {
    if (points.length > 1) {
      geometry.push(new Polygon(...points))
    }
    points = []
  },
  [keys.ONE]: _ => {
    timeit('Default Navmesh', _ => {
      navmesh = new NavMesh()
      navmesh.generate(geometry)
    })
    console.log(navmesh)
  },
  [keys.TWO]: _ => {
    timeit('Mine Navmesh', _ => {
      navmesh = new MineNavMesh()
      navmesh.generate(geometry)
    })
    console.log(navmesh)
  },
  [keys.THREE]: _ => {
    timeit('Astar Navmesh', _ => {
      navmesh = new AStarNavMesh()
      navmesh.generate(geometry)
    })
    console.log(navmesh)
  },
  [keys.FOUR]: _ => {
    timeit('Grid Navmesh', _ => {
      navmesh = new GridStarNavMesh()
      navmesh.generate(geometry)
    })
    console.log(navmesh)
  },
  [keys.R]: _ => {
    console.log(`Size: ${navmesh.getSize()}`)
    timeit('Timing Paths', _ => {
      navmesh.search(navmesh.points[0], navmesh.points[navmesh.points.length - 1])
    }, 500)
  },
  [keys.ESC]: _ => {
    points = []
  }
}

engine.draw = render
engine.update = update
engine.onClick = click
engine.keyEvents = keyEvents
engine.start()
