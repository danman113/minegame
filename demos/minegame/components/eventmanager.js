export class Event {
  constructor (time = 0, fn = _ => {}) {
    this.time = time
    this.run = fn
  }
}

export default class EventManager {
  constructor (events = []) {
    this.events = events
  }
  update (timePassed, camera) {
    for (let i = this.events.length - 1; i >= 0; i--) {
      let evt = this.events[i]
      if (evt.time <= timePassed) {
        evt.run(camera)
        this.events.splice(i, 1)
      }
    }
  }
  addEvent (...evts) {
    this.events.push(...evts)
  }
}
