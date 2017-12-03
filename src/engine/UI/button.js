import Container from './container'

const noop = _ => {}

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

export default class Button extends Container {
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
    this.renderDefault = renderDefault
    this.renderHover = renderHover
    this.renderDown = renderDown
    this.update = u
    this.onClick = onClick
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
