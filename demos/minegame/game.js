import { Scene } from 'engine/scene'
import Stage from './components/stage'
import TestLevel from './assets/testlevel.json'
import Level2 from './assets/level2.json'
import { makeFileImporter } from 'engine/importers'

let game = new Scene()

let currentStage = new Stage({
  level: TestLevel,
  onMount: _ => {
    makeFileImporter(document.getElementById('import'), (err, json) => {
      console.log('READING FILE')
      if (!err) {
        currentStage.loadLevel(json)
      } else {
        alert('COULD NOT READ FILE!' + err)
      }
    })
  },
})

setTimeout(function () {
  // console.log(nextStage, game)
  currentStage.loadLevel(Level2)
  game.goto('start')
}, 500)

currentStage.start(game)
game.onEnter(_ => {
  alert('DEV MODE ACTIVATED')
})
// nextStage.start(game)
export default game
