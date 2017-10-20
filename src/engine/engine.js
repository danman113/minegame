class Engine {
  mouse = {
    x: 0,
    y: 0,
    down: false,
    left: false,
    right: false,
    middle: false
  }
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

    this.canvas.addEventListener('mousedown', e => {
      this.mouse.down = true
      this.mouse.left = e.which === 1
      this.mouse.middle = e.which === 2
      this.mouse.right = e.which === 3
    })

    this.canvas.addEventListener('contextmenu', e => e.preventDefault())

    window.addEventListener('mouseup', e => {
      if (e.which === 1) {
        this.mouse.left = false
      } else if (e.which === 3) {
        this.mouse.right = false
      } else {
        this.mouse.middle = false
      }
      if (!this.mouse.left && !this.mouse.right && !this.mouse.middle) {
        this.mouse.down = false
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
