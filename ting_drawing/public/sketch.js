let lines = []

function setup() {
    let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent("p5-canvas-container");
}

function draw() {
  background(220, 50, 10);

  stroke(0);
  noFill();
  strokeWeight(10);
  for(let line of lines){
    beginShape()
    for(let p of line.points){
      // console.log(p)
      vertex(p[0], p[1])
    }
    endShape()
  } 

}


// NEW LINE STARTED
// either I start new line:
function touchStarted(){
  let p = [touches[0].x, touches[0].y ]
  lines.push( new MyLine(p) );
  // tell server i started line
}
// or the other phone starts new line:

// socket.on("new-line-started", function(point){
//   lines.push( new MyLine(p) );
// })


// NEW POINT ON LINE
// either I am drawing:
function touchMoved(){
  let p = [touches[0].x, touches[0].y ]
  lines[lines.length-1].points.push(p);
  // tell server about new point
}
// or other person is drawing
// socket.on("new-point-on-line", function(point){
//   lines[lines.length-1].points.push(p);
// })


function touchEnded(){
  lines[lines.length-1].finished = true;
  console.log(lines)
  // tell server
}
// socket.on("new-line-finished", function(point){
//   lines[lines.length-1].finished = true;
//   console.log(lines)
// })


class MyLine{
  constructor(startPoint){
    this.points = [startPoint];
    this.opacity = 0;
    this.created = Date.now();
    this.finished = false;
  }
}