let myMap;
let canvas;
let mappa = new Mappa('Leaflet');
let currentLongitude = 0;
let currentLatitude = 0;
let mapInit = false;
let me; 

// init map
let mappa_options = {
  lat: 0,
  lng: 0, 
  zoom: 16,
  // style: "https://b.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png"
  // style: "https://webrd01.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=7&x={x}&y={y}&z={z}",
  style: 'https://webst01.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=6&x={x}&y={y}&z={z}',
}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent("p5-canvas-container");
  me = new MyPoint()
  
  
}

function draw() {
  clear();

  // Initialize full screen map
  if(!mapInit && GPS_GRANTED && currentLongitude!= 0){
    console.log("starting map");
    mappa_options.lat = currentLatitude;
    mappa_options.lng = currentLongitude;
    myMap = mappa.tileMap(mappa_options); 
    myMap.overlay(canvas);
    myMap.onChange(updateMapContent);
    mapInit = true
  }
  if(mapInit){



    me.update();
    me.display();
    // console.log(me)
  }
  


}

// P5 touch events: https://p5js.org/reference/#Touch

function touchStarted() {
  // console.log(touches);
  if(mapInit){
    let pos = myMap.pixelToLatLng(touches[0].x, touches[0].y);
    console.log("TOUCHED", pos);
  }else{
    console.log("TOUCHED", touches);
  }
   

}

function touchMoved() {
}

function touchEnded() {
}

function windowResized(){
  resizeCanvas(windowWidth, windowHeight);
}

// function handleOrientation(eventData){
//   document.querySelector('#requestOrientationButton').style.display = "none";

//   console.log(eventData.alpha, eventData.beta, eventData.gamma);
  
//   alpha = eventData.alpha;
//   beta = eventData.beta;
//   gamma = eventData.gamma;
    
// }
function handleNewPosition(pos){
  // pos = fixForChineseMap(pos);
  // console.log("new position", pos)
  let a = fixForChineseMap(pos);
  currentLongitude = a[0];
  currentLatitude = a[1];
  console.log(currentLatitude, currentLongitude)


  if(mapInit){
    updateMapContent();
    
  }
  
//     [currLon, currLat] = wgs84togcj02(lon, lat);

  
  // drawPoint();
 
  //       }
  // );
}

function updateMapContent(){
  let myPosOnCanvas = myMap.latLngToPixel(currentLatitude, currentLongitude)
  me.goalX = myPosOnCanvas.x;
  me.goalY = myPosOnCanvas.y;
  // console.log("received", a)
  // console.log("---")
}

// function drawPoint(){
//  // let la = myMap.latLngToPixel(lat, lon);
// //  clear();
//   let la = myMap.latLngToPixel(currentLatitude, currentLongitude);
//   circle(la.x, la.y)

// }


// class Coin{
//   constructor(lat, lon){
//     this.lat = lat;
//     this.lon = lon;
    
//     this.found = false;
//   }
//   update(){
//     let la = myMap.latLngToPixel(this.lat, this.lon);
//     this.x = la.x;
//     this.y = la.y;
//     // if(random()<0.001 && this.found == false){
//     //   this.triggerFound();
//     // }
//   }
//   display(){
//     push();

//     translate(this.x, this.y);
//     // scale(0.1)
//     if(this.found == false){
//       let dia = pxForMeters(30, this.lat)
//       image(coinImg, -dia/2, -dia/2, dia, dia)
//     }
    
//     // fill("red")
    
//     // const z = myMap.zoom(), z0 = 12, basePx = 20;
//     // const sizePx = basePx * Math.pow(2, z - z0);
//     // circle(0, 0, dia)

//     pop();
//   }
//   triggerFound(){
//     this.found = true;
//     for(let i = 0; i < 100; i++){
//       confettis.push( new Confetti(this.x, this.y) )
//     }
//     // confettis.push(new Confetti(this.x, this.y))
//   }
// }


class MyPoint{
  constructor(){
    this.x = 0;
    this.y = 0;
    this.goalX = 0;
    this.goalY = 0;
    this.size = 14;
    this.col = color(170, 240, 190);

  }
  update(){
    this.x = lerp(this.x, this.goalX, 0.2)
    this.y = lerp(this.y, this.goalY, 0.2)

  }
  display(){
    push();
    translate(this.x, this.y);
    fill(this.col);
    stroke("pink");
    strokeWeight(3)
    let dia = this.size + sin(frameCount*0.1)
    circle(0, 0, dia);

    pop();
  }
}