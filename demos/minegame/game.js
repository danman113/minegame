import { Scene } from 'engine/scene'
import Stage from './components/stage'
import TestLevel from './assets/testlevel.json'
import Level2 from './assets/level2.json'
import RioLevel from './assets/riolevel2.json'
import RioLevel3 from './assets/riolevel3hallway.json'
import HaoLevel1 from './assets/haolevel1.json'
import HaoLevel2 from './assets/haolevel2.json'
import RioLevel4 from './assets/riolevel4.json'
import { makeFileImporter } from 'engine/importers'

let game = new Scene()
game.state.currentLevel = 'test'

const getLevel = levelStr => {
  console.log(levelStr)
  switch (levelStr) {
  case 'test':
    return TestLevel
  case 'level1':
    return RioLevel4
  case 'level2':
    return RioLevel
  case 'level3':
    return RioLevel3
  case 'level4':
    return HaoLevel1
  case 'level5':
    return HaoLevel2
  default:
    alert('Level Not Loaded')
    return TestLevel
  }
}

let currentStage = new Stage({
  level: TestLevel,
  onMount: _ => {

  },
})

game.onEnter = _ => {
  // alert('game start')
  console.log('currentStage')
  console.log(currentStage)
  currentStage.start(game)
  currentStage.loadLevel(getLevel(game.state.currentLevel))
  makeFileImporter(document.getElementById('import'), (err, json) => {
    console.log('READING FILE')
    if (!err) {
      currentStage.loadLevel(json)
    } else {
      alert('COULD NOT READ FILE!' + err)
    }
  })
}

//
// setTimeout(function () {
//   // console.log(nextStage, game)
//   currentStage.loadLevel(Level2)
//   game.goto('start')
// }, 500)
currentStage.start(game)
// nextStage.start(game)
export default game
