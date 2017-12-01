export default class KeyBoardButtonManager {
  constructor ({
    children = []
  }) {
    this.selected = null
    this.children = children
  }

  addEdge (btn, {
    ...rest
  }) {
    btn.buttons = rest
    this.children.push(btn)
  }

  select (btn) {
    this.selected = btn
  }

  callDirection (direction) {
    if (this.selected) {
      if (this.selected.buttons) {
        if (typeof this.selected.buttons[direction] === 'object') {
          this.select(this.selected.buttons[direction])
        } else if (typeof this.selected.buttons[direction] === 'function') {
          this.selected.buttons[direction](this.selected, this)
        }
      } else {
        throw new Error(
          'Selected is either not a button or has no method for direction'
        )
      }
    }
  }

  handleUpdate (e) {
    for (let btn of this.children) {
      if (btn.state === 1) {
        this.select(btn)
      }
    }
    for (let btn of this.children) {
      if (this.selected === btn && btn.state < 2) {
        btn.state = 1
      }
    }
  }

  handleKey (e, key, evt) {
    this.callDirection(key)
  }
}
