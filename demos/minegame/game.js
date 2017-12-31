import { Scene } from 'engine/scene'
import Stage from './components/stage'
import TestLevel from './assets/levels/testlevel.json'
import Level1 from './assets/levels/level1.json'
import Level2 from './assets/levels/level2.json'
import Level3 from './assets/levels/level3.json'
import Level4 from './assets/levels/level4.json'
import Level5 from './assets/levels/level5.json'
import Level6 from './assets/levels/level6.json'
import Level7 from './assets/levels/level7.json'
import tutorial from './assets/levels/tutorial.json'

let game = new Scene()
game.state.currentLevel = 'test'

const getLevel = levelStr => {
  console.log(levelStr)
  switch (levelStr) {
  case 'tutorial':
    return tutorial
  case 'level1':
    return Level1
  case 'level2':
    return Level2
  case 'level3':
    return Level3
  case 'level4':
    return Level4
  case 'level5':
    return Level5
  case 'level6':
    return Level6
  case 'level7':
    return Level7
  default:
    alert('Level Not Loaded')
    return TestLevel
  }
}

let currentStage = new Stage({
  level: TestLevel,
  onMount: _ => {},
})

game.onEnter = _ => {
  console.log('currentStage')
  console.log(currentStage)
  currentStage.start(game)
  currentStage.loadLevel(getLevel(game.state.currentLevel))
}

currentStage.start(game)
export default game
