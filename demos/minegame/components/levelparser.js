import { pt, Polygon } from 'math'
import Geometry from './geometry'

const parseGeometry = obj => {
  if (obj.polygon) {
    let poly = []
    const xOffset = obj.x
    const yOffset = obj.y
    for (let point of obj.polygon) {
      let newpt = pt(xOffset + point.x, yOffset + point.y)
      poly.push(newpt)
    }
    let newpoly = new Polygon(...poly)
    if (obj.rotation) {
      newpoly.rotateDeg(obj, obj.rotation)
    }
    return new Geometry({
      polygon: newpoly,
      rotation: obj.rotation,
      visible: obj.visible
    })
  }
}

export const loadTiled = json => {
  let geometry = []
  for (let layer of json.layers) {
    switch (layer.name) {
    case 'geometry':
      console.log(layer)
      for (let obj of layer.objects) {
        let newGeo = parseGeometry(obj)
        if (newGeo) {
          geometry.push(newGeo)
        }
      }
      break
    }
  }
  return {
    geometry
  }
}
