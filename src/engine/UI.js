import { pt, sum, sub, Polygon, rectToPolygon } from '../math'
import * as keys from './keys'

const noop = _ => {}

class UIElement {
  constructor ({
    update = noop,
    render = noop,
    position = pt(0, 0),
    children = [],
    polygon = new Polygon()
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

  renderChildren (c) {
    for (let child of this.children) {
      child.render(c)
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

class Container extends UIElement {
  constructor (
    {
      dimensions = rectToPolygon(0, 0, 100, 100),
      render = c => this.renderChildren(c),
      ...rest
    }
    ) {
    super({render, ...rest})
    this.dimensions = dimensions
  }
}

const defaultHoverButtonRender = function (c) {
  c.fillStyle = this.fillColor
  const rect = this.dimensions.AABB()
  c.fillRect(this.globalPosition.x, this.globalPosition.y, rect.width, rect.height)
  c.fillStyle = this.textColor
  c.font = this.fontSize + 'px ' + this.font
  const width = c.measureText(this.text)
  let x = 0
  let y = 0
  if (this.textAlign === 'center') {
    x = this.globalPosition.x + rect.width / 2 - Math.min(width.width / 2, rect.width / 2)
  } else {
    x = this.globalPosition.x
  }
  if (this.verticalAlign === 'center') {
    y = this.globalPosition.y + (rect.height * 1) / 2 + this.fontSize / 4
  } else {
    y = this.globalPosition.y + this.fontSize
  }
  c.fillText(this.text, x, y, rect.width)
  this.renderChildren(c)
}

const defaultButtonRender = function (c) {
  const rect = this.dimensions.AABB()
  c.fillStyle = this.strokeColor
  c.fillRect(this.globalPosition.x, this.globalPosition.y, rect.width, rect.height)
  c.fillStyle = this.fillColor
  c.fillRect(this.globalPosition.x, this.globalPosition.y, rect.width, rect.height * 0.75)
  c.fillStyle = this.textColor
  c.font = this.fontSize + 'px ' + this.font
  const width = c.measureText(this.text)
  let x = 0
  let y = 0
  if (this.textAlign === 'center') {
    x = this.globalPosition.x + rect.width / 2 - Math.min(width.width / 2, rect.width / 2)
  } else {
    x = this.globalPosition.x
  }
  if (this.verticalAlign === 'center') {
    y = this.globalPosition.y + (rect.height * 1) / 2 + this.fontSize / 4
  } else {
    y = this.globalPosition.y + this.fontSize
  }
  c.fillText(this.text, x, y, rect.width)
  this.renderChildren(c)
}

class Button extends Container {
  static states = ['default', 'hover', 'down']
  constructor ({
    text = '',
    font = 'sans-serif',
    fontSize = 14,
    textColor = '#fff',
    fillColor = '#2E9AFE',
    strokeColor = '#084B8A',
    textAlign = 'center',
    verticalAlign = 'center',
    update = noop,
    onClick = _ => console.log('click'),
    render = c => {
      if (this.state === 1) {
        this.renderHover(c)
      } else if (this.state === 2) {
        this.renderDown(c)
      } else {
        this.renderDefault(c)
      }
    },
    renderDefault = defaultButtonRender,
    renderHover = defaultHoverButtonRender,
    renderDown = defaultButtonRender,
    ...rest
  }) {
    super({render, update, ...rest})
    const oldUpdate = this.update
    const u = (e, scene) => {
      this.dimensions.translate(this.globalPosition.x, this.globalPosition.y)
      const intersects = this.dimensions.intersectsPt(e.mouse)
      this.dimensions.translate(-this.globalPosition.x, -this.globalPosition.y)
      const down = e.mouse.down
      if (intersects && down) {
        this.state = 2
      } else if (intersects && !down) {
        this.state = 1
      } else {
        this.state = 0
      }
      oldUpdate(e, scene)
    }
    this.text = text
    this.font = font
    this.fontSize = fontSize
    this.textColor = textColor
    this.fillColor = fillColor
    this.strokeColor = strokeColor
    this.textAlign = textAlign
    this.verticalAlign = verticalAlign
    this.renderDefault = renderDefault.bind(this)
    this.renderHover = renderHover.bind(this)
    this.renderDown = renderDown.bind(this)
    this.update = u
    this.onClick = onClick.bind(this)
    this.state = 0
  }

  handleClick (e) {
    if (this.state === 2) {
      this.onClick(e)
    }
    for (let child of this.children) {
      if (child.handleClick) {
        child.handleClick(e)
      }
    }
  }

  _addClickHandler () {
    if (this.parent && !this.parent.handleClick) {
      this.parent.handleClick = this.handleClick
      this.parent.handleClick()
    }
  }

  _onChildAdd () {
    this._addClickHandler()
  }
}

class Draggable extends Button {
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

class KeyBoardButtonManager {
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

export { Button, Container, UIElement, Draggable, KeyBoardButtonManager }
