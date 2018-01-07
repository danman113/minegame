import { pt, distance, scalar, sum, unit, sub, Segment, Circle } from 'math'
import { drawSegment } from 'engine/renderer'
import { memoize } from 'engine/utils'
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
    this.src = null
    this.dest = null
    this.size = 0
  }

  generate (geom) {
    return geom
  }

  search () {
    return []
  }

  getNearestPoint () {
    return null
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
      }
    }

    for (let point of this.points) {
      if (settings.points) {
        c.fillStyle = 'blue'
        c.fillRect(point.position.x - 5, point.position.y - 5, 11, 11)
      }
      for (let neighbor of point.neighbors) {
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

    for (let i = 0, j = 1; j < this.path.length; i++, j++) {
      let p0 = this.path[i].point
      let p1 = this.path[j].point
      const seg = new Segment(p0.position, p1.position)
      drawSegment(c, seg, 'yellow', 'green')
    }
    if (this.src) {
      c.fillStyle = 'green'
      c.fillRect(this.src.position.x - 5, this.src.position.y - 5, 11, 11)
    }
    if (this.dest) {
      c.fillStyle = 'green'
      c.fillRect(this.dest.position.x - 5, this.dest.position.y - 5, 11, 11)
    }
  }
}

export class MineNavMesh extends NavMesh {
  constructor (...args) {
    super(...args)
    this.search = memoize(this.search, (src, dest) => src.label + '_' + dest.label)
  }

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
    const sizeLimit = 25
    for (let i = this.points.length - 1; i >= 0; i--) {
      const nav = this.points[i]
      const circleLimit = new Circle(nav.position, 12)
      for (let nextNav of this.points) {
        if (nav === nextNav) continue
        if (circleLimit.intersectsPt(nextNav.point)) {
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
        let segTop = new Segment(
          sum(nav.position, pt(0, sizeLimit)),
          sum(nextNav.position, pt(0, sizeLimit))
        )
        let segBottom = new Segment(
          sum(nav.position, pt(0, -sizeLimit)),
          sum(nextNav.position, pt(0, -sizeLimit))
        )
        let segLeft = new Segment(
          sum(nav.position, pt(sizeLimit, 0)),
          sum(nextNav.position, pt(sizeLimit, 0))
        )
        let segRight = new Segment(
          sum(nav.position, pt(-sizeLimit, 0)),
          sum(nextNav.position, pt(-sizeLimit, 0))
        )
        let inter = null
        for (let geom of geometry) {
          inter =
            geom.intersectsSegment(seg) || geom.intersectsSegment(segTop) ||
            geom.intersectsSegment(segBottom) || geom.intersectsSegment(segLeft) ||
            geom.intersectsSegment(segRight)
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
    return []
  }

  generate (geometry) {
    this.generatePoints(geometry)
    this.generateNeighbors(geometry)
    this.src = this.points[0]
    this.dest = this.points[this.points.length - 1]
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
    return []
  }
}

export class GridStarNavMesh extends AStarNavMesh {
  gapSize = 70
  topLeft = null
  topRight = null
  generatePoints (geometry) {
    // Get AABB of a list of polygons
    let topLeft = null
    let bottomRight = null
    for (let geo of geometry) {
      let box = geo.AABB()
      if (!topLeft) {
        topLeft = pt(box.x, box.y)
      } else {
        if (box.x < topLeft.x) {
          topLeft.x = box.x
        }
        if (box.y < topLeft.y) {
          topLeft.y = box.y
        }
      }
      if (!bottomRight) {
        bottomRight = pt(box.x + box.width, box.y + box.height)
      } else {
        if (box.x + box.width > bottomRight.x) {
          bottomRight.x = box.x + box.width
        }
        if (box.y + box.height > bottomRight.y) {
          bottomRight.y = box.y + box.height
        }
      }
    }
    // Subtract some so we get a wrapping graph
    topLeft = sub(topLeft, pt(this.gapSize, this.gapSize))
    this.topLeft = topLeft
    this.bottomRight = bottomRight

    // Add a point in a grid pattern
    let x = Math.ceil((bottomRight.x - topLeft.x) / this.gapSize) + 1
    let y = Math.ceil((bottomRight.y - topLeft.y) / this.gapSize) + 1
    for (let i = 0; i < y; i++) {
      for (let j = 0; j < x; j++) {
        let newPoint = pt(
          topLeft.x + j * this.gapSize + (i % 2) * (this.gapSize / 2),
          topLeft.y + i * this.gapSize
        )
        this.addPoints(new NavPoint(newPoint))
      }
    }
  }

  generateNeighbors (geometry) {
    // Use the grid pattern to find good neighbors
    let x = Math.ceil((this.bottomRight.x - this.topLeft.x) / this.gapSize) + 1
    let y = Math.ceil((this.bottomRight.y - this.topLeft.y) / this.gapSize) + 1
    for (let z = this.points.length - 1; z >= 0; z--) {
      let nav = this.points[z]
      let i = Math.floor(z / x)
      let j = z % x

      // add all valid neighbors to point
      let neighbors = [[i - 1, j], [i + 1, j], [i, j - 1], [i, j + 1]]
      for (let neighbor of neighbors) {
        if (neighbor[0] >= 0 && neighbor[0] < y && neighbor[1] >= 0 && neighbor[1] < x) {
          let index = neighbor[0] * x + neighbor[1]
          let potentialNeighbor = this.points[index]
          let seg = new Segment(
            nav.position,
            potentialNeighbor.position
          )
          let inter = null
          for (let geom of geometry) {
            inter = geom.intersectsSegment(seg)
            if (inter) break
          }
          if (!inter) {
            nav.addNeighbors(potentialNeighbor)
          }
        }
      }
    }

    // Cull unneded points (needed here to make neighbor generation easy)
    for (let z = this.points.length - 1; z >= 0; z--) {
      let inter = false
      for (let geom of geometry) {
        if (geom.intersectsPt(this.points[z].position)) {
          inter = true
          break
        }
      }
      if (inter) this.points.splice(z, 1)
    }
  }
}
