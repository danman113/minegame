import { Scene } from 'engine/scene'
import Stage from './components/stage'
import TestLevel from './assets/testlevel.json'
import Level2 from './assets/level2.json'

let game = new Scene()

let currentStage = new Stage({
  level: TestLevel
})

setTimeout(function () {
  // console.log(nextStage, game)
  currentStage.loadLevel(Level2)
  game.goto('start')
}, 500)

currentStage.start(game)
// nextStage.start(game)
export default game
