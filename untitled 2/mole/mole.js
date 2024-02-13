//The code for our example game

/**
 * The main controller. 
 * The main job of the controller is to add new moles to the scene.
 * The main controller also stores the score
 * and updates the score text when the score changes.
 */
class MoleControllerComponent extends Component {
  
  //Track the creation of moles
  maxTime = 5;
  timeSinceLastMole = this.maxTime

  //The current score
  score = 0;
  start() {
    
  }
  addMole(){
    let toAdd = new MoleGameObject();
    GameObject.instantiate(toAdd)
    let moleComponent = toAdd.getComponent("MoleComponent")
    moleComponent.addListener(this)
    toAdd.transform.x = (Math.random()*2-1)*10;
    toAdd.transform.y = (Math.random()*2-1)*10;
    // toAdd.transform.x = 0;
    // toAdd.transform.y = 0;
    
    
    let toAddFollower = new MoleFollowerGameObject()
    GameObject.instantiate(toAddFollower);
    let followingComponent = toAddFollower.getComponent("MoleFollowerComponent")
    followingComponent.following = toAdd;

    moleComponent.addListener(followingComponent);
    
  }
  update() {
    if(this.timeSinceLastMole >= this.maxTime){
      this.addMole();
      this.timeSinceLastMole = 0;
    }
    this.timeSinceLastMole += Time.deltaTime;
  }
  handleUpdate(event){
    this.score++;
    this.updateListeners(event);
  }
  
}

/**
 * Listen for mouse events. If there is a click, destroy ourselves 
 * if is within our radius
 */
class MoleComponent extends Component{
  update(ctx){
    if(Input.mouseUp){
      //Grab the screen coordinates of the mouse
      let screenX = Input.mouseX;
      let screenY = Input.mouseY;

      //Convert the mouse coordinates into world scoordinates
      let worldCoords = Camera.screenToWorld(ctx, screenX, screenY);
      
      if(!worldCoords) return;

      //Get the offset from the mouse world coordinates and the 
      //center of the circle
      let deltaX = this.transform.x - worldCoords.x;
      let deltaY = this.transform.y - worldCoords.y
      let distance = Math.sqrt(deltaX**2 + deltaY**2);

      //If the Euclidean distance is close enough, destroy 
      //ourselves and fire off an event for anyone listening.
      if(distance < this.transform.sx)
      {
        this.parent.destroy()
        this.updateListeners("MoleClick")
      }
    }
  }
}

/**
 * Container for the Mole component
 */
class MoleGameObject extends GameObject{
  name = "MoleGameObject"
  start(){
    //Add the Mole Component
    this.addComponent(new MoleComponent());

    //Add a blue circle
    this.addComponent(new Circle("blue"))

    //Set the default circle size
    this.transform.sx = 5;
    this.transform.sy = 5;
  }
}

/**
 * Component that moves the text to where the corresponding mole is
 */
class MoleFollowerComponent extends Component{
  following
  update(ctx){
    if(!this.following) return;
    let otherTransform = this.following.transform;
    let destination = Camera.worldToGUI(ctx, otherTransform.x, otherTransform.y);
    this.transform.x = destination.x;
    this.transform.y = destination.y;

  }
  handleUpdate(event){
    //If there is an event, assume it is our event, 
    //and destroy ourselves.
    this.parent.destroy();
  }
}

/**
 * Game object that has both the text and the
 * mole following component
 */
class MoleFollowerGameObject extends GameObject{
  name = "MoleFollowerGameObject"
  start(){
    this.addComponent(new GUITextCentered("Click", "gray", "2pt Arial"))
    this.addComponent(new MoleFollowerComponent());
  }
}

class ScoreComponent extends Component{
  start(ctx){
    this.controller = GameObject.getObjectByName("MoleControllerGameObject").getComponent("MoleControllerComponent");
    this.controller.addListener(this);
  }
  update(ctx){
   

  }
  handleUpdate(event){
     this.parent.getComponent("GUIText").string = "Score: " + this.controller.score;

  }
}

/**
 * The scene for our game
 */
class MoleScene extends Scene {
  start() {
    this.addGameObject(
      new GameObject("MoleControllerGameObject")
        .addComponent(new MoleControllerComponent())
        .addComponent(new CameraMover())
    )
    this.addGameObject(
      new GameObject("ScoreGameObject")
        .addComponent(new ScoreComponent())
        .addComponent(new GUIText("Score: 0", "black", "5px Arial")),
      new Vector2(10,10)
    )
  }
}

//export the main scene so the .html file can run the game.
export default new MoleScene();