import { pt } from 'math'

export class Mob {
  constructor (pos = pt(0, 0)) {
    this.position = pos
  }
  render (c, camera) {
    c.fillStyle = '#f22'
    c.beginPath()
    c.arc(
      this.position.x + camera.position.x,
      this.position.y + camera.position.y,
      20, 0, Math.PI * 2
    )
    c.fill()
  }
}
