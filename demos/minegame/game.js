import { Scene } from 'engine/scene'
import Stage from './components/stage'
import TestLevel from './assets/levels/testlevel.json'
import RioLevel from './assets/levels/riolevel2.json'
import RioLevel3 from './assets/levels/riolevel3hallway.json'
import HaoLevel1 from './assets/levels/riolevel6.json'
import HaoLevel2 from './assets/levels/haolevel2.json'
import RioLevel4 from './assets/levels/riolevel4.json'
import RioLevel5 from './assets/levels/riolevel5.json'
import delta from './assets/levels/testleveldelta.json'
import tutorial from './assets/levels/tutorial.json'

let game = new Scene()
game.state.currentLevel = 'test'

const getLevel = levelStr => {
  console.log(levelStr)
  switch (levelStr) {
  case 'tutorial':
    return tutorial
  case 'level1':
    return RioLevel4
  case 'level2':
    return HaoLevel1
  case 'level3':
    return HaoLevel2
  case 'level4':
    return delta
  case 'level5':
    return RioLevel3
  case 'level6':
    return RioLevel5
  case 'level7':
    return RioLevel
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
