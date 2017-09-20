import { pt } from '../math'

class Engine {
  mouse = pt(0, 0)
  keys = {}
  keyEvents = {}
  constructor (canvas) {
    this.canvas = canvas
    this.context = canvas.getContext('2d')
  }
  draw (c) {}
  update (delta) {}
  run (delta) {
    this.update(delta)
    this.draw(this.context)
    window.requestAnimationFrame(delta => this.run(delta))
  }
  start () {
    this.canvas.addEventListener('mousemove', e => {
      this.mouse.x = e.pageX
      this.mouse.y = e.pageY
    })
    window.addEventListener('keydown', e => {
      this.keys[e.keyCode] = true
    }, false)
    window.addEventListener('keyup', e => {
      if (typeof this.keyEvents[e.keyCode] !== 'undefined') { this.keyEvents[e.keyCode]() }
      delete this.keys[e.keyCode]
    }, false)
    this.run()
  }
}

export default Engine
