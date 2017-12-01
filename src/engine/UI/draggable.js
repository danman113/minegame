import { pt, sub, sum } from 'math'
import Button from './button'

export default class Draggable extends Button {
  constructor ({...rest}) {
    super({...rest})
    this.dragging = null
    this.originalPosition = null
    this.lastState = 0
    const oldUpdate = this.update
    const u = (e, scene) => {
      if (this.state === 2 && this.lastState === 1 && !this.dragging) {
        this.dragging = pt(e.mouse.x, e.mouse.y)
        this.originalPosition = pt(this.position.x, this.position.y)
      }
      if (this.dragging && e.mouse.down) {
        const difference = sub(e.mouse, this.dragging)
        this.position = sum(this.originalPosition, difference)
      } else if (!e.mouse.down && this.dragging) {
        this.dragging = null
        this.originalPosition = null
      }
      this.lastState = this.state
      oldUpdate(e, scene)
    }
    this.update = u
  }
}
