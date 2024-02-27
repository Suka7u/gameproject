class Globals {
  static bulletcount = 0
  static bulletmax = 1
  static health = 3
  static coins = 0
}

class StartController extends Component {
  start() {
    Camera.main.fillStyle = "cyan"
  }
  update() {
      if (keysDown["q"]) {
          SceneManager.changeScene(1)
      }

  }

}

class StartScene extends Scene {
  start(){
    this.addGameObject(new GameObject("StartControllerGameObject").addComponent(new StartController()))
    this.addGameObject(new GameObject("WelcomeTextGameObject").addComponent(new Text("Welcome", "black", "15px Arial")), new Vector2(-30, 0))
    this.addGameObject(new GameObject("StartDirectionTextGameObject").addComponent(new Text("Press q to Start", "black", "3px Arial")), new Vector2(-40, 20))
    this.addGameObject(new GameObject("WDirectionTextGameObject").addComponent(new Text("w = up", "black", "5px Arial")), new Vector2(-40, 40))
    this.addGameObject(new GameObject("ADirectionTextGameObject").addComponent(new Text("a = left", "black", "5px Arial")), new Vector2(-40, 45))
    this.addGameObject(new GameObject("SDirectionTextGameObject").addComponent(new Text("s = down", "black", "5px Arial")), new Vector2(-40, 55))
    this.addGameObject(new GameObject("DDirectionTextGameObject").addComponent(new Text("d = right", "black", "5px Arial")), new Vector2(-40, 50))
    this.addGameObject(new GameObject("FDirectionTextGameObject").addComponent(new Text("f = shoot", "black", "5px Arial")), new Vector2(-40, 60))
  }
}

class ShopButtonControllerComponent extends Component {
  update(ctx) {
    if(Input.mouseUp){
      let screenX = Input.mouseX;
      let screenY = Input.mouseY;

      let guiCoords = Camera.screenToGUI(ctx, screenX, screenY);
      if(!guiCoords){
        return
      }
      let dX = this.transform.x - guiCoords.x
      let dY = this.transform.y - guiCoords.y
      let distance = Math.sqrt(dX**2 + dY**2)
      if(distance < 4.5)
      {
        SceneManager.changeScene(2)
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
    if(Globals.health <= 0) {
      SceneManager.changeScene(3)
    }
    if(this.dashcounter <= 5) {
      this.dashcounter += 1/5
    }
    else if(this.dashcounter <= 25) {
      this.dashcounter += 1/25
    }
    if (Input.keyDown["d"]) {
      if(!this.dash){
        this.transform.x += this.speed * Time.deltaTime
      }
      else {
        this.transform.x += 2
        this.dash = false
      }
    }
    if (Input.keyDown["a"]) {
      if(!this.dash){
        this.transform.x -= this.speed * Time.deltaTime
      }
      else {
        this.transform.x -= 2
        this.dash = false
      }
    }
    if (Input.keyDown["s"]) {
      this.transform.y += this.speed * Time.deltaTime
    }
    if (Input.keyDown["w"]) {
      this.transform.y -= this.speed * Time.deltaTime
    }

    if (Globals.bulletmax >= 10) {
      if(Input.keyDown["f"]) {
        if (Globals.bulletcount < Globals.bulletmax) {
          let bullet = GameObject.instantiate(
            new BulletGameObject())
          Globals.bulletcount += 1
        }
      }
    }
    else {
      if(Input.keyUp["f"]) {
        if (Globals.bulletcount < Globals.bulletmax) {
          let bullet = GameObject.instantiate(
            new BulletGameObject())
          Globals.bulletcount += 1
        }
      }
    }

    if(Input.keyUp["e"]) {
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


    let enemyGameObject = GameObject
    .getObjectsByName("EnemyGameObject")
    if(!enemyGameObject) {
      return
    }
    else {
      for(let i = 0; i < enemyGameObject.length; i++) {
        let left = this.transform.x - this.transform.sx / 2;
        let right = this.transform.x + this.transform.sx / 2;
        let bottom = this.transform.y - this.transform.sy / 2
        let top = this.transform.y + this.transform.sy / 2

        let enemyleft = enemyGameObject[i].transform.x - enemyGameObject[i].transform.sx / 2;
        let enemyright = enemyGameObject[i].transform.x + enemyGameObject[i].transform.sx / 2;
        let enemybottom = enemyGameObject[i].transform.y - enemyGameObject[i].transform.sy / 2
        let enemytop = enemyGameObject[i].transform.y + enemyGameObject[i].transform.sy / 2

      if (!(left > enemyright || enemyleft > right
        || right < enemyleft || enemyright < left
        || bottom > enemytop || enemybottom > top
        || top < enemybottom || enemytop < bottom))
      {
          enemyGameObject[i].destroy()
          Globals.health --;
      } 
      }
    }

    let bossGameObject = GameObject
    .getObjectsByName("BossGameObject")
    if(!bossGameObject) {
      return
    }
    else {
      for(let i = 0; i < bossGameObject.length; i++) {
        let left = this.transform.x - this.transform.sx / 2;
        let right = this.transform.x + this.transform.sx / 2;
        let bottom = this.transform.y - this.transform.sy / 2
        let top = this.transform.y + this.transform.sy / 2

        let bossleft = bossGameObject[i].transform.x - bossGameObject[i].transform.sx / 2;
        let bossright = bossGameObject[i].transform.x + bossGameObject[i].transform.sx / 2;
        let bossbottom = bossGameObject[i].transform.y - bossGameObject[i].transform.sy / 2
        let bosstop = bossGameObject[i].transform.y + bossGameObject[i].transform.sy / 2

      if (!(left > bossright || bossleft > right
        || right < bossleft || bossright < left
        || bottom > bosstop || bossbottom > top
        || top < bossbottom || bosstop < bottom))
      {
          Globals.health --;
      } 
      }
    }




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


class BoundaryTrackerComponent extends Component {
  update() {
    let playerGameObject = GameObject
      .getObjectByName("PlayerGameObject")

    let maxDifference = 10;
    let differencex = playerGameObject.transform.x - this.transform.x;
    let differencey = playerGameObject.transform.y - this.transform.y;

    if (differencex > maxDifference) {
      this.transform.x += differencex - maxDifference
    }
    else if (differencex < -maxDifference) {
      this.transform.x += differencex + maxDifference
    }
    if (differencey > maxDifference) {
      this.transform.y += differencey - maxDifference
    }
    else if (differencey < -maxDifference) {
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
    let difference = playerGameObject.transform.x - this.transform.x
    let differencey = playerGameObject.transform.y - this.transform.y
    if(difference > 0) {
      if (difference < 25) {
        difference += 30
      }
      this.transform.x += difference / speed
    }
    else if(difference < 0) {
      if (difference > -25) {
        difference -= 30
      }
      this.transform.x += difference / speed
    }
    if(differencey > 0) {
      if (differencey < 25) {
        differencey += 30
      }
      this.transform.y += differencey / speed
    }
    else if(differencey < 0) {
      if (differencey > -25) {
        differencey -= 30
      }
      this.transform.y += differencey / speed
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

class BossComponent extends Component {
  health = 10
  start(){
    this.transform.x = Math.random() * (200 - 100) + 100;
    this.transform.y = Math.random() * 100;
    this.transform.sx = 20
    this.transform.sy = 20
  }
  update(){
    if(this.health <= 0) {
      this.parent.destroy()
    }
    let playerGameObject = GameObject
      .getObjectByName("PlayerGameObject")
    let speed = 100
    let difference = playerGameObject.transform.x - this.transform.x
    let differencey = playerGameObject.transform.y - this.transform.y
    if(difference > 0) {
      if (difference < 25) {
        difference += 30
      }
      this.transform.x += difference / speed
    }
    else if(difference < 0) {
      if (difference > -25) {
        difference -= 30
      }
      this.transform.x += difference / speed
    }
    if(differencey > 0) {
      if (differencey < 25) {
        differencey += 30
      }
      this.transform.y += differencey / speed
    }
    else if(differencey < 0) {
      if (differencey > -25) {
        differencey -= 30
      }
      this.transform.y += differencey / speed
    }

    let bulletGameObject = GameObject
    .getObjectsByName("BulletGameObject")
    if(!bulletGameObject) {
      return
    }
    else{
      for(let i = 0; i < bulletGameObject.length; i++) {

        let distance = Math.sqrt((this.transform.x - bulletGameObject[i].transform.x) ** 2 + (this.transform.y - bulletGameObject[i].transform.y) ** 2);

        if(distance < 10 && distance > 0) {

          console.log("Hit")
          Globals.bulletcount -= 1
          bulletGameObject[i].destroy()
          this.health -= 1

    }
      }
    }
  }
}


class BossGameObject extends GameObject {
  name = "BossGameObject"
  start() {
    this.addComponent(new BossComponent())
    this.addComponent(new Rectangle("red"))
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

class MainCoinCountComponent extends Component{
  start(ctx){
    this.controller = GameObject.getObjectByName("MainControllerGameObject").getComponent("MainControllerComponent");
    this.controller.addListener(this);
  }
  update(ctx){
   

  }
  handleUpdate(event){
     this.parent.getComponent("GUIText").string = "Coins: " + Globals.coins;

  }
}

class MainControllerComponent extends Component {
  enemycount = 1
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

    if (Math.random() < .008) {
      let enemy = GameObject.instantiate(
        new EnemyGameObject())
      this.enemycount += 1
    }

    if (this.enemycount % 10 == 0) {
      this.enemycount += 1
      let enemy = GameObject.instantiate(
        new BossGameObject()
      )
    }

    let bulletGameObjects = GameObject.getObjectsByName("BulletGameObject")
    if(!bulletGameObjects || Globals.bulletcount <= 0) {
      Globals.bulletcount = 0
    }
  }
  handleUpdate(event){
    Globals.coins ++;
    this.updateListeners(event);
  }
}

class MainScene extends Scene {
  start() {

    this.addGameObject(
      new GameObject("PlayerHealthGameObject").addComponent(new PlayerHealthCountComponent())
        .addComponent(new Text("Health: 3", "black", "3px Arial")),
      new Vector2(10,15)
    )

    this.addGameObject(new GameObject("WallsGameObject").addComponent(new WallsComponent()))
    this.addGameObject(
      new GameObject("PlayerGameObject").addComponent(new Rectangle("pink")).addComponent(new PlayerComponent()),
      new Vector2(50, 50), new Vector2(5, 5)
    )
    
    this.addGameObject(new GameObject("ShopButtonGameObject")
      .addComponent(new GUIRectangle("yellow")).addComponent(new ShopButtonControllerComponent()),
      new Vector2(75, 5), new Vector2(11, 5))

    this.addGameObject(new GameObject("ShopButtonTextGameObject").addComponent(new GUIText("Shop", "black", "4px Arial")), new Vector2(70, 6))
    
    /*GameObject.instantiate(
      new EnemyGameObject()) */

    GameObject.instantiate(
      new CoinGameObject())

    this.addGameObject(
      new GameObject("BoundaryTrackerGameObject")
        .addComponent(new BoundaryTrackerComponent()),
      new Vector2(0, 0),
      new Vector2(2, 2)
    )
  
    this.addGameObject(new GameObject("MainControllerGameObject").addComponent(new MainControllerComponent()))

    this.addGameObject(
      new GameObject("CoinsGameObject")
        .addComponent(new MainCoinCountComponent())
        .addComponent(new GUIText("Coins: 0", "black", "5px Arial")),
      new Vector2(10,10)
    )
    
    let coinsGameObject = GameObject.getObjectByName("CoinsGameObject")
    coinsGameObject.getComponent("GUIText").string = "Coins: " + Globals.coins;

  }
}

class ShopController extends Component {
  start() {
    Camera.main.fillStyle = "cyan"
  }
  update() {
      if (keysDown["q"]) {
          SceneManager.changeScene(1)
      }

  }
}

class ShopCoinCountComponent extends Component{
  start(ctx){
  }
  update(ctx){
    this.parent.getComponent("GUIText").string = "Coins: " + Globals.coins;

  }
}

class HealthCountComponent extends Component{
  start(ctx){
  }
  update(ctx){
    this.parent.getComponent("GUIText").string = "Health: " + Globals.health;

  }
}

class BulletCountComponent extends Component{
  start(ctx){
  }
  update(ctx){
    this.parent.getComponent("GUIText").string = "Bullets: " + Globals.bulletmax;

  }
}

class PlayerHealthCountComponent extends Component{
  start(ctx){
  }
  update(ctx){
    let playerGameObject = GameObject.getObjectByName("PlayerGameObject")
    this.transform.x = playerGameObject.transform.x - 5
    this.transform.y = playerGameObject.transform.y - 5
    this.parent.getComponent("Text").string = "Health: " + Globals.health;

  }
}

class PurchaseButtonControllerComponent extends Component {
  update(ctx) {
    if(Input.mouseUp){
      let screenX = Input.mouseX;
      let screenY = Input.mouseY;

      let guiCoords = Camera.screenToGUI(ctx, screenX, screenY);
      if(!guiCoords){
        return
      }
      let dX = this.transform.x - guiCoords.x
      let dY = this.transform.y - guiCoords.y
      let distance = Math.sqrt(dX**2 + dY**2)
      if(distance < 4.5 && Globals.coins >= 5)
      {
        if(this.transform.x == 21 && this.transform.y == 28) {
          Globals.coins -= 5
          Globals.bulletmax += 1
        }
        if(this.transform.x == 21 && this.transform.y == 35) {
          Globals.coins -= 5
          Globals.health += 1
        }
        if(this.transform.x == 69 && this.transform.y == 28 && Globals.coins >= 10) {
          Globals.coins -= 10
          Globals.bulletmax += 3
        }
        if(this.transform.x == 69 && this.transform.y == 35 && Globals.coins >= 10) {
          Globals.coins -= 10
          Globals.health += 3
        }
        if(this.transform.x == 109 && this.transform.y == 28.5 && Globals.coins >= 50) {
          SceneManager.changeScene(4)
        }
      }
    }
  }
}

class ShopScene extends Scene{
  start(){
    this.addGameObject(new GameObject("ShopControllerGameObject").addComponent(new ShopController()))
    this.addGameObject(
      new GameObject("ShopCoinCountGameObject").addComponent(new ShopCoinCountComponent())
        .addComponent(new GUIText("Coins: 0", "black", "5px Arial")),
      new Vector2(10,10)
    )
    this.addGameObject(
      new GameObject("HealthCountGameObject").addComponent(new HealthCountComponent())
        .addComponent(new GUIText("Health: 3", "black", "5px Arial")),
      new Vector2(10,15)
    )
    this.addGameObject(
      new GameObject("BulletCountGameObject").addComponent(new BulletCountComponent())
        .addComponent(new GUIText("Bullets: 1", "black", "5px Arial")),
      new Vector2(35,15)
    )
    this.addGameObject(
      new GameObject("PurchaseTextGameObject").addComponent(new GUIText("5 Coins", "black", "4px Arial")), new Vector2(13,25)
    )
    this.addGameObject(
      new GameObject("ShopTextGameObject").addComponent(new GUIText("SHOP", "black", "5px Arial")), new Vector2(72,10)
    )
    this.addGameObject(
      new GameObject("PurchaseButtonGameObject").addComponent(new GUIRectangle("white")).addComponent(new PurchaseButtonControllerComponent()), new Vector2(21,28), new Vector2(22,5)
    )
    this.addGameObject(
      new GameObject("PurchaseTextGameObject").addComponent(new GUIText("+1 Bullet", "black", "5px Arial")), new Vector2(10,30)
    )
    this.addGameObject(
      new GameObject("PurchaseButtonGameObject").addComponent(new GUIRectangle("white")).addComponent(new PurchaseButtonControllerComponent()), new Vector2(21,35), new Vector2(22,5)
    )
    this.addGameObject(
      new GameObject("PurchaseTextGameObject").addComponent(new GUIText("+1 Health", "black", "5px Arial")), new Vector2(10,37)
    )

    this.addGameObject(
      new GameObject("PurchaseTextGameObject").addComponent(new GUIText("10 Coins", "black", "4px Arial")), new Vector2(60,25)
    )

    this.addGameObject(
      new GameObject("PurchaseButtonGameObject").addComponent(new GUIRectangle("white")).addComponent(new PurchaseButtonControllerComponent()), new Vector2(69,28), new Vector2(22,5)
    )
    this.addGameObject(
      new GameObject("PurchaseTextGameObject").addComponent(new GUIText("+3 Bullets", "black", "5px Arial")), new Vector2(58,30)
    )
    this.addGameObject(
      new GameObject("PurchaseButtonGameObject").addComponent(new GUIRectangle("white")).addComponent(new PurchaseButtonControllerComponent()), new Vector2(69,35), new Vector2(22,5)
    )
    this.addGameObject(
      new GameObject("PurchaseTextGameObject").addComponent(new GUIText("+3 Health", "black", "5px Arial")), new Vector2(58,37)
    )

    this.addGameObject(
      new GameObject("PurchaseTextGameObject").addComponent(new GUIText("50 Coins", "black", "4px Arial")), new Vector2(100,25)
    )
    this.addGameObject(
      new GameObject("PurchaseButtonGameObject").addComponent(new GUIRectangle("green")).addComponent(new PurchaseButtonControllerComponent()), new Vector2(109,28.5), new Vector2(22,5)
    )
    this.addGameObject(
      new GameObject("PurchaseTextGameObject").addComponent(new GUIText("Victory", "black", "5px Arial")), new Vector2(102,30)
    )
    this.addGameObject(new GameObject("BackDirectionTextGameObject").addComponent(new Text("Press q to go back", "black", "7px Arial")), new Vector2(-25, 20))
  }
}

class DeathController extends Component {
  start() {
    Camera.main.fillStyle = "cyan"
  }
  update() {
    if (keysDown["q"]) {
      Globals.health = 3
      SceneManager.changeScene(1)
  }
  }
}

class DeathScene extends Scene {
  start(){
    this.addGameObject(new GameObject("DeathControllerGameObject").addComponent(new DeathController()))
    this.addGameObject(new GameObject("EndTextGameObject").addComponent(new Text("Game Over", "red", "20px")), new Vector2(-23, 10))
    this.addGameObject(new GameObject("RestartDirectionTextGameObject").addComponent(new Text("Press q to Restart", "black", "4px Arial")), new Vector2(-17, 20))
  }
}

class VictoryController extends Component {
  start() {
    Camera.main.fillStyle = "cyan"
  }
}

class VictoryScene extends Scene {
  start(){
    this.addGameObject(new GameObject("VictoryControllerGameObject").addComponent(new VictoryController()))
    this.addGameObject(new GameObject("VictoryTextGameObject").addComponent(new Text("Congratulations, You've Won", "green", "10px")), new Vector2(-66, 20))
  }
}
let startScene = new StartScene()
let mainScene = new MainScene()
let shopScene = new ShopScene()
let deathScene = new DeathScene()
let victoryScene = new VictoryScene()

window.allScenes = [startScene, mainScene, shopScene, deathScene, victoryScene]