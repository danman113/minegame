import { pt, Rectangle, sum, sub, distance, scalar, unit } from 'math'
const noop = _ => {}
export class VirtualJoystick {
  constructor({
    maxRange = 200,
    activationRect = new Rectangle(0, 0, 100, 100),
    onStart = noop,
    onEnd = noop
  }) {
    this.maxRange = maxRange
    this.activationRect = activationRect
    this.onStart = onStart
    this.onEnd = onEnd
    this.position = null
    this.currentPosition = null
  }
  update(e) {
    let currentTouch = null
    for (let touch of e.touches) {
      if (this.activationRect.intersectsPt(touch.position)) {
        currentTouch = touch
        break
      }
    }
    if (currentTouch) {
      if (!this.position) {
        this.onStart(this)
        this.position = pt(currentTouch.position.x, currentTouch.position.y)
      }
      this.currentPosition = pt(currentTouch.position.x, currentTouch.position.y)
      let dist = distance(this.currentPosition, this.position)
      if (dist > this.maxRange) {
        // Clamps the current position to the maxRange relative to the position
        this.currentPosition = sum(
          scalar(
            unit(sub(this.currentPosition, this.position)),
            this.maxRange
          ),
          this.position
        )
      }
    } else {
      if (this.position) {
        this.onEnd(this)
      }
      this.position = null
      this.currentPosition = null
    }
  }
  render (c) {
    if (this.position) {
      c.fillStyle = 'rgba(0, 0, 0, 0.5)'
      c.beginPath()
      c.arc(
        this.position.x,
        this.position.y,
        20, 0, Math.PI * 2
      )
      c.fill()
    }

    if (this.currentPosition) {
      c.fillStyle = 'rgba(0, 0, 0, 0.5)'
      c.beginPath()
      c.arc(
        this.currentPosition.x,
        this.currentPosition.y,
        20, 0, Math.PI * 2
      )
      c.fill()
    }
  }
}