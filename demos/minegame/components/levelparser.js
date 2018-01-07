import { pt, Polygon } from 'math'
import Player from './player'
import { BasicEnemy } from './mob'
import { NavPoint } from './navmesh'
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
      ...obj.properties,
      polygon: newpoly,
      rotation: obj.rotation,
      visible: obj.visible,
    })
  }
}

const parseMobs = obj => {
  if (obj.properties) {
    switch (obj.properties.mob) {
    case 'player':
      return new Player(obj.x, obj.y)
    case 'basic':
      return new BasicEnemy(obj.x, obj.y, obj.properties.spawnTime || 0, obj.properties.round || 0)
    default:
    }
    // texture = obj.properties.texture
  }
}

const parseNavMesh = obj => {
  return new NavPoint(pt(obj.x, obj.y))
}

export const loadTiled = json => {
  let geometry = []
  let mobs = []
  let navPoints = []
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
    case 'mobs':
      console.log(layer)
      for (let obj of layer.objects) {
        let mob = parseMobs(obj)
        if (mob) {
          mobs.push(mob)
        }
      }
      break
    case 'navmesh':
      console.log(layer)
      for (let obj of layer.objects) {
        let navPoint = parseNavMesh(obj)
        if (navPoint) {
          navPoints.push(navPoint)
        }
      }
      break
    }
  }
  return {
    geometry,
    mobs,
    navPoints
  }
}
