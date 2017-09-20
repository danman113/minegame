import { pt } from '../math'

class Engine {
  mouse = pt(0, 0)
  keys = {}
  keyEvents = {}
  draw (c) {}
  update (delta) {}
  constructor (canvas) {
    this.canvas = canvas
    this.context = canvas.getContext('2d')
  }
  run (delta) {
    this.update(delta)
    this.draw(this.context)
    window.requestAnimationFrame(delta => this.run(delta))
  }
  start () {
    this.canvas.addEventListener('mousemove', e => {
      if (e.offsetX) {
        this.mouse.x = e.offsetX
        this.mouse.y = e.offsetY
      } else if (e.layerX) {
        var box = this.canvas.getBoundingClientRect()
        this.mouse.x = e.layerX - box.left
        this.mouse.y = e.layerY - box.top
      }
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
