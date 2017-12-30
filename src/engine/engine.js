import 'babel-polyfill'

class Engine {
  // Data to handle mouse events. Updated each frame
  mouse = {
    x: 0,
    y: 0,
    down: false,
    left: false,
    right: false,
    middle: false
  }

  touches = []
  touchmode = false

  state = {}

  _width = 500
  _height = 500

  settings = {
    width: this._width,
    height: this._height,
    fullscreen: false
  }

  // Contains keys that are pressed. Updated each frame
  keys = {}

  // keycode -> func map. When the key with the keycode is pressed,
  // it will call func
  keyEvents = {}

  // callback for click events
  onClick (engine) {}
  keyUp (engine, key, event) {}

  // drawn each frame
  draw (engine, c) {}

  // updated each frame
  update (engine, delta) {}

  // Hooks into an element
  constructor (root, width = 500, height = 500, fullscreen = false) {
    let canvas = document.createElement('canvas')
    root.appendChild(canvas)
    this.canvas = canvas
    this.settings.fullscreen = fullscreen

    if (fullscreen) {
      this.width = window.innerWidth
      this.height = window.innerHeight
    } else {
      this.width = width
      this.height = height
    }
    this.context = canvas.getContext('2d')
  }

  // Starts the event loop
  run (delta) {
    this.update(this, delta)
    this.draw(this, this.context)
    window.requestAnimationFrame(delta => this.run(delta))
  }

  // Initializes events
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

      if (e.which === 1) {
        this.mouse.left = true
      }
      if (e.which === 2) {
        this.mouse.middle = true
      }
      if (e.which === 3) {
        this.mouse.right = true
      }
    })

    this.canvas.addEventListener('contextmenu', e => e.preventDefault())
    this.canvas.addEventListener('dragenter', e => e.preventDefault())
    console.log(this.canvas)

    window.addEventListener('mouseup', e => {
      this.onClick(this)
      if (e.which === 1) {
        this.mouse.left = false
      } else if (e.which === 3) {
        this.mouse.right = false
      } else if (e.which === 2) {
        this.mouse.middle = false
      }
      if (!this.mouse.left && !this.mouse.right && !this.mouse.middle) {
        this.mouse.down = false
      }
    })

    window.addEventListener('keydown', e => {
      this.keys[e.keyCode] = true
      if (!e.ctrlKey && !e.metaKey) {
        e.preventDefault()
      }
    }, false)

    window.addEventListener('keyup', e => {
      if (typeof this.keyEvents[e.keyCode] === 'function') { this.keyEvents[e.keyCode](this) }
      delete this.keys[e.keyCode]
      this.keyUp(this, e.keyCode, e)
    }, false)

    window.addEventListener('resize', _e => {
      if (this.settings.fullscreen) {
        this.width = window.innerWidth
        this.height = window.innerHeight
      }
    }, false)

    this.canvas.addEventListener('touchstart', evt => {
      this.touchmode = true
      evt.preventDefault()
      for (let i = 0; i < evt.changedTouches.length; i++) {
        let touch = evt.touches[i]
        if (i === 0) {
          this.mouse.down = true
          if (touch.pageX) {
            this.mouse.x = touch.pageX
            this.mouse.y = touch.pageY
          }
        }
      }
    }, false)

    this.canvas.addEventListener('touchend', _e => {
      this.onClick(this)
      this.mouse.down = false
      console.log('touchend', _e)
    }, false)

    this.canvas.addEventListener('touchcancel', _e => {
      console.log('touchcancel', _e)
    }, false)

    this.canvas.addEventListener('touchmove', evt => {
      // console.log('touchmove', evt)
      evt.preventDefault()
      for (let i = 0; i < evt.changed.length; i++) {
        let touch = evt.changedTouches[i]
        if (i === 0) {
          this.mouse.down = true
          if (touch.pageX) {
            this.mouse.x = touch.pageX
            this.mouse.y = touch.pageY
          }
        }
      }
    }, false)

    this.run(0)
  }

  set width (w) {
    this._width = w
    this.settings.width = w
    this.canvas.width = w
    this.canvas.style.width = w + 'px'
  }

  get width () { return this._width }

  set height (h) {
    this._height = h
    this.settings.height = h
    this.canvas.height = h
    this.canvas.style.height = h + 'px'
  }

  get height () { return this._height }
}

export default Engine
