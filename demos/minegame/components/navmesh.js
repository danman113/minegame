import { pt, distance, Segment, Circle } from 'math'
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
  constructor (points = []) {
    this.points = []
    this.addPoints(...points)
    this.newPQ()
    this.size = 0
  }

  newPQ () {
    this.pq = new PriorityQueue((a, b) => -(a.cost - b.cost))
  }

  addPoints (...points) {
    for (let point of points) {
      point.label = this.size++
      this.points.push(point)
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

  computeNavmeshNeighbors (geometry) {
    for (let i = this.points.length - 1; i >= 0; i--) {
      const nav = this.points[i]
      let circle = new Circle(nav.position, 30)
      for (let geom of geometry) {
        if (circle.intersectsPoly(geom.polygon)) {
          this.points.splice(i, 1)
          break
        }
      }
    }

    for (let nav of this.points) {
      for (let nextNav of this.points) {
        if (nav === nextNav) continue
        let seg = new Segment(
          nav.position,
          nextNav.position
        )
        let inter = null
        for (let geom of geometry) {
          inter = geom.polygon.intersectsSegment(seg)
          if (inter) break
        }
        if (!inter) {
          nav.addNeighbors(nextNav)
        }
      }
      nav.neighbors.sort((a, b) => a.cost - b.cost)
      nav.neighbors.splice(8, 20)
    }
    console.log('navmeshComplete')
    console.log(this.points)
  }

  getNearestPoint (pt) {
    let nearest = Infinity
    let nearestIndex = -1
    for (let i = 0, size = this.points.length; i < size; i++) {
      let np = this.points[i].position
      let dist = (np.x - pt.x) * (np.x - pt.x) + (np.y - pt.y) * (np.y - pt.y)
      if (dist < nearest) {
        nearest = dist
        nearestIndex = i
      }
    }
    return this.points[nearestIndex]
  }
}
