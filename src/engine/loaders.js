import { Howl } from 'howler'

console.log(Howler)

export class ImageLoader {
  constructor (manifest) {
    this.manifest = manifest
    this.images = {}
    for (let name in manifest) {
      const img = new Image()
      img.src = manifest[name]
      img.loaded = false
      this.images[name] = img
      img.addEventListener('load', _ => {
        img.loaded = true
      }, false)
    }
  }

  get loaded () {
    let i = 0
    for (let name in this.images) {
      let img = this.images[name]
      if (img.loaded) {
        i++
      }
    }
    return i
  }

  get total () {
    let i = 0
    for (let _name in this.images) {
      i++
    }
    return i
  }
}

export class AudioLoader {
  constructor (manifest) {
    this.manifest = manifest
    this.assets = {}
    for (let name in manifest) {
      let src = null
      if (typeof manifest[name] === 'string') {
        src = [manifest[name]]
      } else {
        src = manifest[name]
      }
      console.log(src)
      const asset = new Howl({
        src: src
      })
      console.log(asset)
      asset.loaded = false
      this.assets[name] = asset
      asset.once('load', _ => {
        console.log(asset)
        console.log(Array(16).join('*'))
        asset.loaded = true
      }, false)
    }
  }

  get loaded () {
    let i = 0
    for (let name in this.assets) {
      let asset = this.assets[name]
      if (asset.loaded) {
        i++
      }
    }
    return i
  }

  get total () {
    let i = 0
    for (let _name in this.assets) {
      i++
    }
    return i
  }
}
