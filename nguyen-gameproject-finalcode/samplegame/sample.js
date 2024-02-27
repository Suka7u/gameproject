class ControllerComponent extends Component {
  name = "ControllerComponent"
  start() {
    Camera.main.fillStyle = "deepskyblue"
  }
  update() {
    if (Math.random()) {
      if (Math.random() < .3) {
        let back = GameObject.instantiate(
          new BackgroundGameObject())
          let snow = GameObject.instantiate(
            new SnowGameObject())
      }
    }
    if (Math.random()) {
      if (Math.random() < .3) {
        let front = GameObject.instantiate(
          new ForegroundGameObject())
        let snow = GameObject.instantiate(
          new SnowGameObject())
        }
      }
    }
  }

class MovementControllerComponent extends Component {
  name = "MovementControllerComponent"
  start() {
    if (Math.random() > .5) {
      this.transform.x = -Math.random() * 50
    }
    else {
      this.transform.x = Math.random() * 50
    }
  }
  update() {
    this.transform.y += 20 * Time.deltaTime;
    if(this.transform.y > 150){
      this.parent.destroy();
    }
  }
}

class SnowControllerComponent extends Component {
  name = "SnowControllerComponent"
  start() {
    if (Math.random() > .5) {
      this.transform.x = -Math.random() * 50
    }
    else {
      this.transform.x = Math.random() * 50
    }
    this.transform.y = -50
  }
  update() {
    this.transform.y += 20 * Time.deltaTime;
    if(this.transform.y > 1){
      this.parent.destroy();
    }
  }
}

class PlayerComponent extends Component {
  name = "PlayerComponent"
  start(){
    this.speed = 30
  }
  update() {
    if (Input.keyDown["d"]) {
      this.transform.x += this.speed * Time.deltaTime
    }
    if (Input.keyDown["a"]) {
      this.transform.x -= this.speed * Time.deltaTime
    }
    if (Input.keyDown["s"]) {
      this.transform.y += this.speed * Time.deltaTime
    }
    if (Input.keyDown["w"]) {
      this.transform.y -= this.speed * Time.deltaTime
    }
  }

}

class PlayerNoseComponent extends Component {
  name = "PlayerNoseComponent"
  update(){
    let playerGameObject = GameObject.getObjectByName("PlayerGameObject")
    this.transform.x = playerGameObject.transform.x
    this.transform.y = playerGameObject.transform.y + 1
  }
}

class PlayerLeftEyeComponent extends Component {
  name = "PlayerLeftEyeComponent"
  update(){
    let playerGameObject = GameObject.getObjectByName("PlayerGameObject")
    this.transform.x = playerGameObject.transform.x + 1
    this.transform.y = playerGameObject.transform.y - 1
  }
}

class PlayerRightEyeComponent extends Component {
  name = "PlayerRightEyeComponent"
  update(){
    let playerGameObject = GameObject.getObjectByName("PlayerGameObject")
    this.transform.x = playerGameObject.transform.x - 1
    this.transform.y = playerGameObject.transform.y - 1
  }
}

class PlayerRightAntlerComponent extends Component {
  name = "PlayerRightAntlerComponent"
  update(){
    let playerGameObject = GameObject.getObjectByName("PlayerGameObject")
    this.transform.x = playerGameObject.transform.x - 1.5
    this.transform.y = playerGameObject.transform.y - 3
  }
}

class PlayerLeftAntlerComponent extends Component {
  name = "PlayerLeftAntlerComponent"
  update(){
    let playerGameObject = GameObject.getObjectByName("PlayerGameObject")
    this.transform.x = playerGameObject.transform.x + 1.5
    this.transform.y = playerGameObject.transform.y - 3
  }
}

class BackgroundGameObject extends GameObject {
  name = "BackgroundGameObject"
  start() {
    this.layer = -1
    this.addComponent(new Rectangle("red"))
    this.addComponent(new MovementControllerComponent())
  }
}

class ForegroundGameObject extends GameObject {
  name = "ForegroundGameObject"
  start() {
    this.layer = -1
    this.addComponent(new Rectangle("green"))
    this.addComponent(new MovementControllerComponent())
  }
}

class SnowGameObject extends GameObject {
  name = "SnowGameObject"
  start() {
    this.layer = 1
    this.addComponent(new Rectangle("white"))
    this.addComponent(new SnowControllerComponent())
  }
}

class SampleScene extends Scene {
  start() {

    this.addGameObject(
      new GameObject("SpaceGameObject")
        .addComponent(new Rectangle("black")),
      new Vector2(0, -25), new Vector2(100, 50)
    )

    this.addGameObject(
      new GameObject("PlayerGameObject")
        .addComponent(new PlayerComponent())
        .addComponent(new Rectangle("brown")),
      new Vector2(0, 45), new Vector2(5, 5)
    )

    this.addGameObject(
      new GameObject("PlayerNoseGameObject")
        .addComponent(new PlayerNoseComponent())
        .addComponent(new Circle("red")),
      new Vector2(0, 0), new Vector2(1, 1)
    )

    this.addGameObject(
      new GameObject("PlayerLeftEyeGameObject")
        .addComponent(new PlayerLeftEyeComponent())
        .addComponent(new Rectangle("black")),
      new Vector2(0, 0), new Vector2(1, 1)
    )

    this.addGameObject(
      new GameObject("PlayerRightEyeGameObject")
        .addComponent(new PlayerRightEyeComponent())
        .addComponent(new Rectangle("black")),
      new Vector2(0, 0), new Vector2(1, 1)
    )

    this.addGameObject(
      new GameObject("PlayerLeftAntlerGameObject")
        .addComponent(new PlayerLeftAntlerComponent())
        .addComponent(new Rectangle("chocolate")),
      new Vector2(0, 0), new Vector2(1, 2)
    )

    this.addGameObject(
      new GameObject("PlayerRightAntlerGameObject")
        .addComponent(new PlayerRightAntlerComponent())
        .addComponent(new Rectangle("chocolate")),
      new Vector2(0, 0), new Vector2(1, 2)
    )

    this.addGameObject(
      new GameObject("ControllerGameObject").addComponent(new ControllerComponent())
    )
  }
}

export default new SampleScene();