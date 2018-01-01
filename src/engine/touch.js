import { pt } from 'math'

export default class Touch {
  constructor (touch, supersampling = 1) {
    this.position = pt(touch.pageX * supersampling, touch.pageY * supersampling)
  }
}

export const getTouches = (touchEvent, supersampling = 1) => {
  let arr = []
  for (let touch of touchEvent.touches) {
    arr.push(new Touch(touch, supersampling))
  }
  return arr
}