/**
 * A point engine-level component
 */
class Point extends Component {
  /** The name of the component */
  name = "Point"

  /** The fill color of the component */
  fillStyle

  /** The stroke color of the component */
  strokeStyle

  /** The width of the stroke */
  lineWidth

  /**
   * Create a point component. 
   * Has an optional color for fillStyle
   * @param {Color} fillStyle The fill color of the point. Defaults to white.
   * @param {Color} strokeStyle The outline color of the point. Defaults to transparent.
   * @param {Number} lineWidth The thickness of the outline. Defaults to 1.
   */
  constructor(fillStyle = "white", strokeStyle = "transparent", lineWidth = 1) {
    super();
    this.fillStyle = fillStyle
    this.strokeStyle = strokeStyle
    this.lineWidth = lineWidth;
  }

  /**
   * Draw the point to the given context.
   * @param {CanvasRenderingContext2D} ctx The context to draw to.
   */
  draw(ctx) {
    //Set the fill style
    ctx.fillStyle = this.fillStyle
    ctx.strokeStyle = this.strokeStyle
    ctx.lineWidth = this.lineWidth

    
    // Draw the point
    ctx.beginPath()
    ctx.arc(this.transform.x, this.transform.y, this.transform.sx, 0, Math.PI * 2)
    ctx.fill()
    ctx.stroke();
  }
}

//Add point to the global namespace.
window.Point = Point;