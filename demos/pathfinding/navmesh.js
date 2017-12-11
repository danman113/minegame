import { pt, distance, scalar, sum, unit, sub, Segment, Circle } from 'math'
import { drawSegment } from 'engine/renderer'
import PriorityQueue from 'priorityqueuejs'

export class NavPoint {
  constructor (pos = pt(0, 0)) {
    this.position = pos
    this.neighbors = []
    this.label = -1
  }

  addNeighbors (...neighbors) {
    for (let neighbor of neighbors) {
      let n = {cost: distance(this.position, neighbor.position), point: neighbor}
      this.neighbors.push(n)
    }
  }
}

export default class NavMesh {
  constructor () {
    this.points = []
    this.path = []
    this.size = 0
  }

  generate (geom) {
    return geom
  }

  search () {
    return []
  }

  getSize () {
    let size = 0
    for (let point of this.points) {
      size += point.neighbors.length
    }
    return size
  }

  addPoints (...points) {
    for (let point of points) {
      point.label = this.size++
      this.points.push(point)
    }
  }

  render (c, e, settings) {
    for (let point of this.points) {
      for (let neighbor of point.neighbors) {
        const seg = new Segment(point.position, neighbor.point.position)
        drawSegment(c, seg)
        let circle = new Circle(e.mouse, 50)
        let p0 = point
        let p1 = neighbor.point
        let halfway = sum(p0.position, scalar(sub(p1.position, p0.position), 0.5))
        c.fillStyle = 'red'
        let inter = circle.intersectsPt(halfway)
        if (inter) {
          c.fillRect(halfway.x - 5, halfway.y - 5, 11, 11)
          c.fillStyle = 'white'
          c.fillText(neighbor.cost.toFixed(2), halfway.x, halfway.y - 20)
        }
      }
    }

    for (let point of this.points) {
      if (settings.points) {
        c.fillStyle = 'blue'
        c.fillRect(point.position.x - 5, point.position.y - 5, 11, 11)
      }
    }

    for (let i = 0, j = 1; j < this.path.length; i++, j++) {
      let p0 = this.path[i].point
      let p1 = this.path[j].point
      const seg = new Segment(p0.position, p1.position)
      drawSegment(c, seg, 'yellow', 'green')
    }
  }
}

export class MineNavMesh extends NavMesh {
  generatePoints (geometry) {
    for (let geo of geometry) {
      let center = geo.center()
      for (let vertex of geo.verticies) {
        let direction = scalar(unit(sub(vertex, center)), 75)
        const point = pt(vertex.x + direction.x, vertex.y + direction.y)
        let inter = false
        for (let geo2 of geometry) {
          if (geo2.intersectsPt(point)) {
            inter = true
            break
          }
        }
        if (inter) continue
        let np = new NavPoint(point)
        this.addPoints(np)
      }
    }
  }

  generateNeighbors (geometry) {
    for (let nav of this.points) {
      for (let nextNav of this.points) {
        if (nav === nextNav) continue
        let seg = new Segment(
          nav.position,
          nextNav.position
        )
        let inter = null
        for (let geom of geometry) {
          inter = geom.intersectsSegment(seg)
          if (inter) break
        }
        if (!inter) {
          nav.addNeighbors(nextNav)
        }
      }
      nav.neighbors.sort((a, b) => a.cost - b.cost)
      // nav.neighbors.splice(8, 20)
    }
  }

  generatePath () {
    this.path = this.search(this.points[0], this.points[this.points.length - 1])
  }

  newPQ () {
    this.pq = new PriorityQueue((a, b) => -(a.cost - b.cost))
  }

  search (source, target) {
    if (!source || !target) return []
    this.newPQ()
    let openSet = this.pq
    let closedSet = {}
    openSet.enq({cost: 0, point: source, parent: null})
    while (!openSet.isEmpty()) {
      const smallest = openSet.deq()
      if (smallest.point === target) {
        closedSet[smallest.point.label] = smallest
        let returnList = []
        for (let node = closedSet[target.label]; true; node = closedSet[node.parent.point.label]) {
          returnList.unshift(node)
          if (node.parent === null) break
        }
        return returnList
      } else {
        let i = 0
        for (let neighbor of smallest.point.neighbors) {
          i++
          if (i > 6) break
          var edge = {
            cost: smallest.cost + neighbor.cost,
            point: neighbor.point,
            parent: smallest
          }
          // console.log(`Adding node with cost ${edge.cost}`, edge)
          if (closedSet[edge.point.label]) {
            continue
          }
          openSet.enq(edge)
        }
        closedSet[smallest.point.label] = smallest
      }
    }
  }

  generate (geometry) {
    this.generatePoints(geometry)
    this.generateNeighbors(geometry)
    this.generatePath()
  }

  getNearestPoint (pt) {
    let nearest = Infinity
    let nearestIndex = -1
    for (let i = 0, size = this.points.length; i < size; i++) {
      let np = this.points[i].position
      let dist = distance(pt, np)
      if (dist < nearest) {
        nearest = dist
        nearestIndex = i
      }
    }
    return this.points[nearestIndex]
  }
}

export class AStarNavMesh extends MineNavMesh {
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
  }
}
