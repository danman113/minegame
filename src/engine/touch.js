import { pt } from 'math'

export default class Touch {
  constructor (touch) {
    this.position = pt(touch.pageX, touch.pageY)
  }
}

export const getTouches = (touchEvent) => {
  let arr = []
  for (let touch of touchEvent.touches) {
    arr.push(new Touch(touch))
  }
  return arr
}