import { pt, sum, Polygon, rectToPolygon } from '../math'

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
    y = this.globalPosition.y + rect.height / 2 + this.fontSize / 4
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
    y = this.globalPosition.y + (rect.height * 0.75) / 2 + this.fontSize / 4
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
    click = _ => console.log('click'),
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
    let u = (e, scene) => {
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
      update(e, scene)
    }
    super({render, update: u, ...rest})
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
    this.click = click.bind(this)
    this.state = 0
  }
}

export { Button, Container, UIElement }
