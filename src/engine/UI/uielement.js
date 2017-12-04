import { pt, sum, Polygon } from 'math'

const noop = _ => {}

export default class UIElement {
  constructor ({
    update = noop,
    render = noop,
    position = pt(0, 0),
    children = [],
  }) {
    this.position = position
    this.render = render.bind(this)
    this.update = update.bind(this)
    this.children = children
    this.parent = null
  }

  addChildren (...children) {
    for (let child of children) {
      child.parent = this
      child._onChildAdd()
    }
    this.children.push(...children)
  }

  get globalPosition () {
    if (this.parent) {
      return sum(this.parent.globalPosition, this.position)
    } else {
      return this.position
    }
  }

  renderChildren (c, e) {
    for (let child of this.children) {
      child.render(c, e)
    }
  }

  handleUpdate (e, scene) {
    this.update(e, scene)
    for (let child of this.children) {
      child.update(e, scene)
    }
  }

  _onChildAdd () {}
}
