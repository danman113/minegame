import Delaunator from 'delaunator'
import { pt, Segment, Polygon, distance } from 'math'
import { drawSegment, drawPolygon } from 'engine/renderer'
import PriorityQueue from 'priorityqueuejs'

export class NavmeshPoly {
  constructor (p1, p2, p3) {
    this.polygon = new Polygon(p1, p2, p3)
    this.center = this.polygon.center()
    this.neighbors = []
  }
}

const isGeo = (geometry, poly) => {
  for (let geo of geometry) {
    if (geo.intersectsPt(poly.center)) {
      return true
    }
  }
  return false
}

const checkNeighbors = (poly, neighbor) => {
  let pts = 0
  for (let pvertex of poly.polygon.verticies) {
    for (let nvertex of neighbor.polygon.verticies) {
      if (pvertex.x === nvertex.x && pvertex.y === nvertex.y) {
        pts++
      }
    }
    if (pts >= 2) {
      poly.neighbors.push(neighbor)
      return true
    }
  }
  return false
}

export default class DMesh {
  constructor () {
    this.points = []
    this.geometry = []
    this.polygons = []
    this.DMesh = null
  }

  generateNeighbors () {
    // A neighbor is a polygon that contains one of your points
    for (let poly of this.polygons) {
      for (let neighbor of this.polygons) {
        if (
          neighbor === poly || neighbor.polygon.size !== poly.polygon.size
        ) continue
        checkNeighbors(poly, neighbor)
      }
    }
  }

  generate (geometry, e) {
    this.points = [pt(0, 0), pt(0, e.height), pt(e.width, e.height), pt(e.width, 0)]
    for (let geo of geometry) {
      for (let vertex of geo.verticies) {
        this.points.push(vertex)
      }
    }
    this.DMesh = Delaunator.from(this.points, p => p.x, p => p.y)
    const triangles = this.DMesh.triangles
    const points = this.points
    for (let i = 0; i < triangles.length; i += 3) {
      const p1 = points[triangles[i]]
      const p2 = points[triangles[i + 1]]
      const p3 = points[triangles[i + 2]]
      const poly = new NavmeshPoly(p1, p2, p3)
      if (!isGeo(geometry, poly)) {
        this.polygons.push(poly)
      }
    }
    this.generateNeighbors()
  }

  render (c, _e, _settings) {
    for (let poly of this.polygons) {
      drawPolygon(c, poly.polygon, 'rgba(0, 0, 255, 0.7)')
      for (let neighbor of poly.neighbors) {
        const seg = new Segment(poly.center, neighbor.center)
        drawSegment(c, seg, 'yellow')
      }
    }
  }

  search (source, target) {
    if (!source || !target) return []
    let frontier = new PriorityQueue((a, b) => -(a.cost - b.cost))
    // List of cost. Also used for the closed set
    let costSet = {}
    costSet[source.label] = 0
    frontier.enq({cost: 0, point: source, parent: null})
    while (!frontier.isEmpty()) {
      const current = frontier.deq()
      if (current.point === target) {
        let returnList = [current]
        for (let node = current.parent; node !== null; node = node.parent) {
          returnList.unshift(node)
        }
        return returnList
      }
      for (let next of current.point.neighbors) {
        let newCost = costSet[current.point.label] + next.cost
        if (!(next.point.label in costSet) || newCost < costSet[next.point.label]) {
          costSet[next.point.label] = newCost
          frontier.enq({
            cost: newCost + distance(target.position, next.point.position),
            point: next.point,
            parent: current
          })
        }
      }
    }
    return []
  }
}
