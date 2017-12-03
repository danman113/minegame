import { Scene } from 'engine/scene'
import ImageManifest from './imagemanifest.json'
import AudioManifest from './audiomanifest.json'
import { ImageLoader, AudioLoader } from 'engine/loaders'
// import { rectToPolygon, pt } from 'math'
// import { Button, Container, KeyBoardButtonManager } from 'engine/UI'

let loading = new Scene()
let imageLoader = new ImageLoader(ImageManifest)
let audioLoader = new AudioLoader(AudioManifest)

const onEnter = e => {
  e.state.imageLoader = imageLoader
  e.state.audioLoader = audioLoader
}

let frame = 0
const render = (e, c) => {
  // Clear Frame
  frame++
  // console.log(c)
  c.clearRect(0, 0, e.width, e.height)

  // Loading with dots
  const fontSize = 30
  const dots = '...'
  const text = 'Loading'
  c.font = `${fontSize}px sans-serif`
  const textWidth = c.measureText(text).width
  const dotString = dots.substring(0, Math.floor(frame / 40) % 4)
  c.fillStyle = '#eee'
  c.fillText(text + dotString, e.width / 2 - textWidth / 2, e.height / 4 - fontSize * 0.25)

  // Loading Bar
  const loaded = imageLoader.loaded + audioLoader.loaded
  const total = imageLoader.total + audioLoader.total
  const barWidth = 200
  const barHeight = 100
  const barX = e.width / 2 - barWidth / 2
  const barY = e.height * 0.35 - barHeight / 2
  c.fillStyle = '#f44'
  c.fillRect(barX, barY, barWidth * (loaded / total), barHeight)
  c.strokeStyle = '#eee'
  c.lineWidth = 3
  c.strokeRect(barX, barY, barWidth, barHeight)

  // Loading Progress
  const loaded2 = ('0' + loaded).slice(-2)
  const total2 = ('0' + total).slice(-2)
  const loadedText = `Loaded ${loaded2}/${total2} Assets`
  const loadedTextWidth = c.measureText(loadedText).width
  c.fillStyle = '#eee'
  c.fillText(loadedText, e.width / 2 - loadedTextWidth / 2, e.height * 0.5 - fontSize * 0.25)

  c.fillStyle = '#f00'
  c.fillRect(e.mouse.x - 1, e.mouse.y - 1, 3, 3)
}

const update = (_e) => {
  const loaded = imageLoader.loaded + audioLoader.loaded
  const total = imageLoader.total + audioLoader.total
  if (loaded >= total) {
    loading.goto('start')
  }
}

const keyUp = (e, key, evt) => {
  console.log(e, key, evt)
}

loading.render = render
loading.onEnter = onEnter
loading.update = update
// loader.onClick = e => startContainer.handleClick(e)
loading.keyUp = keyUp
export default loading
