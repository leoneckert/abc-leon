let mappa = new Mappa('Leaflet'); // map library
let myMap;
let canvas;
let currentLongitude = 0; // global variables will be updated as we get GPS data
let currentLatitude = 0; // global variables will be updated as we get GPS data
let mapInit = false; // we only do map stuff once mapInit is true (see in draw)
let me; // point object showing our own location
if(location.hostname.toLowerCase().startsWith('browsercircus')){
  socket = io({path: "/YOURPATH-and-PORT/socket.io"});  // yields '/leon/port-4100/socket.io' or '/socket.io'
}else{
  socket = io(); 
}

let landmarks = [
  {
    name: "pearl tower",
    lat: 31.239893774611474,
    lon: 121.49956226348878
  },
  {
    name: "nyu tree",
    lat: 31.148847321681675,
    lon: 121.48139834403993
  }
]

// options for map
// we only actually initialize the map once we get data where we are (in draw)
// there are differnt suppliers and styles of maps available
let mappa_options = {
  lat: 0, // will change once we have data
  lng: 0, // will change once we have data
  zoom: 16, // initial zoom level
  // style: "https://b.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png"
  // style: "https://webrd01.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=7&x={x}&y={y}&z={z}",
  style: 'https://webst01.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=6&x={x}&y={y}&z={z}',
}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent("p5-canvas-container");
  me = new MyPoint();
  
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
    // only update and draw our point if we actually have data
    me.update();
    me.display();
    // console.log(me)

    drawLine(landmarks[0].lon, landmarks[0].lat, landmarks[1].lon, landmarks[1].lat)
    drawRect(landmarks[1].lon, landmarks[1].lat, 10, 10);
    drawRect(landmarks[1].lon, landmarks[1].lat, 50, 50);
    drawRect(landmarks[1].lon, landmarks[1].lat, 80, 80);
    drawRect(landmarks[1].lon, landmarks[1].lat, 120, 120);

  }
}

function drawLine(lon1, lat1, lon2, lat2){
  if(mapInit){
    let p1 = myMap.latLngToPixel(lat1, lon1);
    let p2 = myMap.latLngToPixel(lat2, lon2);
    line(p1.x, p1.y, p2.x, p2.y);
  }
}

function drawRect(lon, lat, widthMeters, heightMeters){
  if(mapInit){
    let w = metersToPixel(widthMeters, lat);
    let h = metersToPixel(heightMeters, lat);
    let p = myMap.latLngToPixel(lat, lon);
    noFill();
    stroke(255);
    rect(p.x, p.y, w, h);
    text(widthMeters, p.x+w-15, p.y+10) // 4 joy only, ignore
  }  
}

function metersToPixel(meters, lat){
  z = myMap.zoom();
  const mpp = 156543.03392 * Math.cos(lat*Math.PI/180) / Math.pow(2, z); // meters/pixel
  return meters / mpp;
}

// P5 touch events: https://p5js.org/reference/#Touch
function touchStarted() {
  if(mapInit){
    let pos = myMap.pixelToLatLng(touches[0].x, touches[0].y);
    console.log("TOUCHED", pos);
  }
}

function touchMoved() {
}

function touchEnded() {
}

function windowResized(){
  resizeCanvas(windowWidth, windowHeight);
}


function handleNewPosition(pos){
  // fix location for chinese map tiles
  let lonlat = fixForChineseMap(pos);
  currentLongitude = lonlat[0];
  currentLatitude = lonlat[1];
  // console.log(currentLatitude, currentLongitude);

  if(mapInit){
    // if map already displayed, update the point
    updateMapContent();
  } 
}

function updateMapContent(){
  let myPosOnCanvas = myMap.latLngToPixel(currentLatitude, currentLongitude)
  me.goalX = myPosOnCanvas.x;
  me.goalY = myPosOnCanvas.y;
}

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
    // lerp to each new location to keep things smoother
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