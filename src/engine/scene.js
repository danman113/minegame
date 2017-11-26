const noop = _ => {}
class Scene {
  constructor (
    keyEvents = {},
    onEnter = noop,
    onClick = noop,
    render = noop,
    update = noop
  ) {
    this.keyEvents = keyEvents
    this.onEnter = onEnter
    this.onClick = onClick
    this.render = render
    this.update = update
    this.goto = noop
  }
}

class SceneManager {
  engine = null
  currentScene = null
  scenes = {}
  constructor (engine, scenes) {
    this.engine = engine
    this.scenes = scenes
  }

  mount (scene, silent = false) {
    scene.goto = this.goto.bind(this)
    const oldScene = this.currentScene
    if (this.currentScene) {
      this.currentScene.goto = noop
    }
    this.currentScene = scene
    this.engine.keyEvents = scene.keyEvents
    this.engine.onClick = scene.onClick
    this.engine.draw = scene.render
    this.engine.update = scene.update
    if (!silent) {
      scene.onEnter(this.engine, oldScene, this)
    }
  }

  goto (sceneName, silent = false) {
    const scene = this.scenes[sceneName]
    if (scene) {
      this.mount(scene, silent)
    } else {
      throw Error('Scene not found!')
    }
  }
}

export {Scene, SceneManager}
