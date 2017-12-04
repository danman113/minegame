import { rectToPolygon } from 'math'
import UIElement from './uielement'

class Container extends UIElement {
  constructor (
    {
      dimensions = rectToPolygon(0, 0, 100, 100),
      render = (c, e) => this.renderChildren(c, e),
      ...rest
    }
  ) {
    super({render, ...rest})
    this.dimensions = dimensions
  }
}

export default Container
