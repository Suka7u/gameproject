class Globals {
  static bulletcount = 0
  static currentmax = 1
  static wavecount = 1
  static enemycount = 0
}
class Persistence {
  static coins = 0
}
/*
  Questions: ctx.rotate(radians)
             keyup for bullets
  
  To add list: Collisions between enemies
             
*/

class ShopButtonControllerComponent extends Component {
  update(ctx) {
    if(Input.mouseUp){
      let screenX = Input.mouseX;
      let screenY = Input.mouseY;

      let guiCoords = Camera.screenToGUI(ctx, screenX, screenY);
      if(!guiCoords) return;
      let deltaX = this.transform.x - guiCoords.x
      let deltaY = this.transform.y - guiCoords.y
      let distance = Math.sqrt(deltaX**2 + deltaY**2)
      if(distance < 4.5)
      {
        SceneManager.changeScene(1)
      }
    }
  }
}

class PlayerComponent extends Component {
  name = "PlayerComponent"
  speed = 15
  start() {
    this.margin = 0
    this.size = 100
    this.dash = false
    this.dashcounter = 30
  }
  update() {
    if(this.dashcounter <= 5) {
      this.dashcounter += 1/5
    }
    else if(this.dashcounter <= 25) {
      this.dashcounter += 1/25
    }
    if (keysDown["d"]) {
      if(!this.dash){
        this.transform.x += this.speed * Time.deltaTime
      }
      else {
        this.transform.x += 2
        this.dash = false
      }
    }
    if (keysDown["a"]) {
      if(!this.dash){
        this.transform.x -= this.speed * Time.deltaTime
      }
      else {
        this.transform.x -= 2
        this.dash = false
      }
    }
    if (keysDown["s"]) {
      this.transform.y += this.speed * Time.deltaTime
    }
    if (keysDown["w"]) {
      this.transform.y -= this.speed * Time.deltaTime
    }
    if (keysDown["f"]) {
      if (Globals.bulletcount < Globals.currentmax) {
        let bullet = GameObject.instantiate(
          new BulletGameObject())
        Globals.bulletcount += 1
      }
    }
    if(keysDown["e"]) {
      if(!this.dash && Math.floor(this.dashcounter) >= 5){
        this.dashcounter -= 1
        if(Math.floor(this.dashcounter >= 25)) {
          this.dash = true
        }
      }
    }

    let coinGameObject = GameObject
    .getObjectsByName("CoinGameObject")

    if(!coinGameObject) {
      return
    }
    else{
      for(let i = 0; i < coinGameObject.length; i++) {
        let distance = Math.sqrt((this.transform.x - coinGameObject[i].transform.x) ** 2 + (this.transform.y - coinGameObject[i].transform.y) ** 2);
        if(distance < 4 && distance > 0) {
          coinGameObject[i].destroy()
          this.updateListeners("CoinCollected")
    }
      }
    }
    //console.log(this.transform.x, this.transform.y)
    if (this.transform.x < this.margin + this.transform.sx / 2) {
      
      this.transform.x = -this.transform.sx / 2 + this.margin + this.size
    }
    if (this.transform.x > this.margin - this.transform.sx / 2 + this.size) {
      this.transform.x = this.transform.sx / 2 + this.margin
    }
    if (this.transform.y > this.size + this.transform.sy / 2) {
      this.transform.y = this.transform.sy / 2 + this.margin
    }
    if (this.transform.y < 0) {
      this.transform.y = -this.transform.sy / 2 + this.size
    }
  }

}

class ControllerComponent extends Component {
  start() {
    Camera.main.fillStyle = "cyan"
    let playerGameObject = GameObject.getObjectByName("PlayerGameObject")
    let playerComponent = playerGameObject.getComponent("PlayerComponent")
    playerComponent.addListener(this)
  }
  update() {
    let tracker;
    tracker = GameObject.getObjectByName("BoundaryTrackerGameObject")
    Camera.main.transform.x = tracker.transform.x;
    Camera.main.transform.y = tracker.transform.y;

    if (Math.random() < .01) {
      let enemy = GameObject.instantiate(
        new EnemyGameObject())
      Globals.enemycount += 1
    }

    let bulletGameObjects = GameObject.getObjectsByName("BulletGameObject")
    if(!bulletGameObjects || Globals.bulletcount < 0) {
      Globals.bulletcount = 0
    }
  }
  handleUpdate(event){
    Persistence.coins ++;
    this.updateListeners(event);
  }
}

//A component that follows the player within a tolerance
//We reference to this tolerance the a boundary.
class BoundaryTrackerComponent extends Component {
  update() {
    let playerGameObject = GameObject
      .getObjectByName("PlayerGameObject")

    //The boundary size
    let maxDifference = 10;
    //The difference between where we are and where the camera is
    let differencex = playerGameObject.transform.x - this.transform.x;
    let differencey = playerGameObject.transform.y - this.transform.y;

    //Check if the difference has exceeded our tolerance
    if (differencex > maxDifference) {
      //The player is to the right
      this.transform.x += differencex - maxDifference
    }
    else if (differencex < -maxDifference) {
      //The player is to the left
      this.transform.x += differencex + maxDifference
    }
    if (differencey > maxDifference) {
      //The player is to the right
      this.transform.y += differencey - maxDifference
    }
    else if (differencey < -maxDifference) {
      //The player is to the left
      this.transform.y += differencey + maxDifference
    }
  }
}

class BulletComponent extends Component {
  start(){
    let playerGameObject = GameObject
      .getObjectByName("PlayerGameObject")
    this.transform.sx = 1
    this.transform.sy = 1
    this.transform.x = Math.floor(playerGameObject.transform.x)
    this.transform.y = playerGameObject.transform.y
    this.limit = 100
  }
  update(){
    if(this.transform.x != this.limit) {
      this.transform.x += 1
    }
    else {
      console.log("Destroyed")
      Globals.bulletcount -= 1
      this.parent.destroy()
    }
    let enemyGameObject = GameObject
    .getObjectsByName("EnemyGameObject")
    if(!enemyGameObject) {
      return
    }
    else{
      for(let i = 0; i < enemyGameObject.length; i++) {

        let distance = Math.sqrt((this.transform.x - enemyGameObject[i].transform.x) ** 2 + (this.transform.y - enemyGameObject[i].transform.y) ** 2);

        if(distance < 2 && distance > 0) {

          if(Math.random() >= 0.66) {

            let coin = GameObject.instantiate(
              new CoinGameObject())

            let coinGameObject = GameObject.getObjectsByName("CoinGameObject")

            if(!coinGameObject){
              return
            }
            else{
              for(let q = 0; q < coinGameObject.length; q++) {
                if(coinGameObject[q].transform.x == -1000) {
                  coinGameObject[q].transform.x = enemyGameObject[i].transform.x
                  coinGameObject[q].transform.y = enemyGameObject[i].transform.y
                }
              }
            }
          }

          console.log("Killed")
          Globals.bulletcount -= 1
          this.parent.destroy()
          enemyGameObject[i].destroy()
    }
      }
    }
    
  }
}
class BulletGameObject extends GameObject {
  name = "BulletGameObject"
  start() {
    this.addComponent(new BulletComponent())
    this.addComponent(new Circle("black"))
  }
}

class EnemyComponent extends Component {
  start(){
    this.transform.x = Math.random() * (200 - 100) + 100;
    this.transform.y = Math.random() * 100;
    this.transform.sx = 2
    this.transform.sy = 2
  }
  update(){
    let playerGameObject = GameObject
      .getObjectByName("PlayerGameObject")
    let speed = 200
    let distance = Math.sqrt((this.transform.x - playerGameObject.transform.x) ** 2 + (this.transform.y - playerGameObject.transform.y) ** 2);
    let difference = playerGameObject.transform.x - this.transform.x
    let differencey = playerGameObject.transform.y - this.transform.y
    if(difference > 0) {
      this.transform.x += difference / speed
    }
    else if(difference < 0) {
      this.transform.x += difference / speed
    }
    if(differencey > 0) {
      this.transform.y += differencey / speed
    }
    else if(differencey < 0) {
      this.transform.y += differencey / speed
    }
    if (distance < 3 && distance > 0) {
      SceneManager.changeScene(0)
    }
  }
}

class EnemyGameObject extends GameObject {
  name = "EnemyGameObject"
  start() {
    this.addComponent(new EnemyComponent())
    this.addComponent(new Rectangle("green"))
  }
}

class CoinComponent extends Component {
  start() {
    this.transform.sx = 2
    this.transform.x = -1000
    this.transform.y = 0
  }
  update() {

  }
}

class CoinGameObject extends GameObject {
  name = "CoinGameObject"
  start() {
    this.addComponent(new CoinComponent())
    this.addComponent(new Circle("yellow"))
  }
}

class WallsComponent extends Component {
  name = "WallsComponent"
  start() {
      this.margin = 0;
      this.size = 100;
  }
  draw(ctx) {
      ctx.strokeStyle = "orange"
      ctx.beginPath()
      ctx.moveTo(this.margin, this.margin)
      ctx.lineTo(this.margin + this.size, this.margin)
      ctx.lineTo(this.margin + this.size, this.margin + this.size)
      ctx.lineTo(this.margin, this.margin + this.size)
      ctx.lineTo(this.margin, this.margin)
      ctx.stroke()
  }
}

class CoinCountComponent extends Component{
  start(ctx){
    this.controller = GameObject.getObjectByName("ControllerGameObject").getComponent("ControllerComponent");
    this.controller.addListener(this);
  }
  update(ctx){
   

  }
  handleUpdate(event){
     this.parent.getComponent("GUIText").string = "Coins: " + Persistence.coins;

  }
}

class MainScene extends Scene {
  start() {

    this.addGameObject(new GameObject("WallsGameObject").addComponent(new WallsComponent()))
    this.addGameObject(
      new GameObject("PlayerGameObject").addComponent(new Rectangle("pink")).addComponent(new PlayerComponent()),
      new Vector2(50, 50), new Vector2(5, 5)
    )
    
    this.addGameObject(new GameObject("ShopButtonGameObject")
      .addComponent(new GUIRectangle("yellow")).addComponent(new ShopButtonControllerComponent()),
      new Vector2(75, 5), new Vector2(11, 5))

    this.addGameObject(new GameObject("ShopButtonTextGameObject").addComponent(new GUIText("Shop", "black", "4px Arial")), new Vector2(70, 6))
    GameObject.instantiate(
      new EnemyGameObject())
    
    GameObject.instantiate(
      new EnemyGameObject())

    GameObject.instantiate(
      new CoinGameObject())

    this.addGameObject(
      new GameObject("BoundaryTrackerGameObject")
        .addComponent(new BoundaryTrackerComponent()),
      new Vector2(0, 0),
      new Vector2(2, 2)
    )
  
    this.addGameObject(new GameObject("ControllerGameObject").addComponent(new ControllerComponent))

    this.addGameObject(
      new GameObject("CoinsGameObject")
        .addComponent(new CoinCountComponent())
        .addComponent(new GUIText("Coins: 0", "black", "5px Arial")),
      new Vector2(10,10)
    )

  }
}
class ShopScene extends Scene{
  start(){
    this.addGameObject(
      new GameObject("CoinsGameObject")
        .addComponent(new GUIText("Coins: 0", "black", "5px Arial")),
      new Vector2(10,10)
    )

    this.addGameObject(
      new GameObject("WelcomeTextGameObject").addComponent(new GUIText("SHOP", "black", "5px Arial")), new Vector2(72,10)
    )
    this.addGameObject(
      new GameObject("PurchaseButtonGameObject").addComponent(new Rectangle("pink")), new Vector2(20,20), new Vector2(10,10)
    )
  }
}
let mainScene = new MainScene()
let shopScene = new ShopScene()

window.allScenes = [mainScene, shopScene]