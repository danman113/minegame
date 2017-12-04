// Have exporters here
// Also have a webpack loader read filepath and generate a manifest.json
// from that which can be imported by a source file.

import { Polygon, pt, Rectangle } from '../math'

// Imports a tiled json map
const importTiledMap = json => {
  let layers = {}
  for (let layer of json.layers) {
    if (layer.objects) {
      let currentLayer = layers[layer.name] = []
      for (let obj of layer.objects) {
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
            newpoly.rotateDeg(newpoly.verticies[0], obj.rotation)
          }
          currentLayer.push(newpoly)
        } else {
          currentLayer.push(new Rectangle(obj.x, obj.y, obj.width, obj.height))
        }
      }
    }
  }
  return layers
}

const readJson = (fileEvent, callback) => {
  let files = fileEvent.target.files
  for (let file of files) {
    const fileSet = file.name.split('.')
    if (fileSet[fileSet.length - 1] === 'json') {
      /* global FileReader */
      let reader = new FileReader()

      reader.onload = function (e) {
        try {
          const json = JSON.parse(reader.result)
          callback(null, json)
        } catch (e) {
          callback(e)
        }
      }

      reader.readAsText(file)
    } else {
      callback(new Error('Cannot read filetype: ' + file.type))
    }
  }
}

const readPlaintext = (fileEvent, callback) => {
  let files = fileEvent.target.files
  for (let file of files) {
    /* global FileReader */
    let reader = new FileReader()

    reader.onload = function (e) {
      try {
        const text = reader.result
        callback(null, text)
      } catch (e) {
        callback(e)
      }
    }

    reader.readAsText(file)
  }
}

const makeFileImporter = (parentElement, callback) => {
  let elem = document.createElement('input')
  elem.type = 'file'
  elem.setAttribute('type', 'file')
  elem.setAttribute('accept', '.json')
  // Makes it so you can resubmit the same file
  elem.addEventListener('click', _ => {
    elem.value = ''
  })
  elem.onchange = e => readJson(e, callback)
  parentElement.appendChild(elem)
}

export { importTiledMap, makeFileImporter, readPlaintext, readJson }
