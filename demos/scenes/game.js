import { Scene, SceneManager } from '../../src/engine/scene'
import { drawPolygon } from '../../src/engine/renderer'
import { pt, Polygon, sub, unit, sum, distance } from '../../src/math'
import * as keys from '../../src/engine/keys'

let game = new Scene()

let asteroids = []

let ship = new Polygon(
  pt(0, 30),
  pt(15, 0),
  pt(30, 30)
)

let velocity = 0
let acceleration = 0
let color = 'red'

const generateAsteroid = _ => {
  let pts = []
  for (let i = 0; i < (Math.PI * 2); i += (Math.PI * 2) / 12) {
    const x = Math.cos(i) * 40 + (Math.random() - 1) * 15
    const y = Math.sin(i) * 40 + (Math.random() - 1) * 15
    pts.push(pt(x, y))
  }
  return new Polygon(...pts)
}

const randomColor = _ =>
  '#' + (Math.random() * 0xFFFFFF << 0).toString(16)

const onEnter = e => {
  velocity = 0
  acceleration = 0
  ship = new Polygon(
    pt(0, 30),
    pt(15, 0),
    pt(30, 30)
  )
  color = 'red'

  ship.translate(e.width / 2, e.height / 2)
  asteroids = []
  for (var i = 0; i < (e.width * e.height) / 30000; i++) {
    const asteroid = generateAsteroid()
    const x = Math.floor(Math.random() * e.width)
    const y = Math.floor(Math.random() * e.height)
    asteroid.translate(x, y)
    if (
      asteroid.intersectsConcavePoly(ship) ||
      (
        distance(ship.center(), asteroid.center()) < 150
      )
    ) {
      i--
      continue
    }
    asteroids.push(asteroid)
  }
}

const render = function (c) {
  c.clearRect(0, 0, this.width, this.height)

  c.fillStyle = '#f00'
  c.fillRect(this.mouse.x - 1, this.mouse.y - 1, 3, 3)

  drawPolygon(c, ship, color || randomColor(), 'blue')

  for (let ast of asteroids) {
    drawPolygon(c, ast, color || randomColor(), 'blue')
  }

  c.fillStyle = '#fff'
  c.font = '20px Arial,sans-serif'
  let messages = [
    'ENTER to go to main menu',
    'Left/Right arrow keys to rotate',
    'Up/Down to move up/reverse',
    'Press S to enable seizure mode'
  ]

  messages.forEach((msg, i) => {
    c.fillText(msg, 0, 30 + i * 30)
  })
}

const keyEvents = {
  [keys.ENTER]: e => { game.goto('main') },
  [keys.S]: _ => { color = color?'':'red' }
}

const update = (e, delta) => {
  for (let asteroid of asteroids) {
    if (ship.intersectsConcavePoly(asteroid)) {
      onEnter(e)
      game.goto('start')
    }
  }

  let upVector = sub(ship.verticies[1], ship.center())
  let directionVector = unit(upVector)
  const maxVelocity = 5
  const turnSpeed = 2
  const accelerationConst = 0.05
  const friction = 0.99
  acceleration = 0
  if (keys.KEY_UP in e.keys) {
    acceleration = 1 * accelerationConst
  }
  if (keys.KEY_DOWN in e.keys) {
    acceleration = -1 * accelerationConst
  }
  if (keys.SHIFT in e.keys) {
    acceleration *= 5
  }
  velocity *= friction
  velocity += acceleration
  velocity = Math.min(Math.max(velocity, -1 * maxVelocity), maxVelocity)

  ship.translate(directionVector.x * velocity, directionVector.y * velocity)

  if (keys.KEY_LEFT in e.keys) {
    ship.rotateDeg(ship.center(), -turnSpeed)
  }
  if (keys.KEY_RIGHT in e.keys) {
    ship.rotateDeg(ship.center(), turnSpeed)
  }
}

game.onEnter = onEnter
game.update = update
game.render = render
game.keyEvents = keyEvents
export default game
