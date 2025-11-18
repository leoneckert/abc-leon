function reload (){
    window.location.reload(true)
}

function handlePermission() {
  navigator.permissions.query({ name: "geolocation" }).then((result) => {
    if (result.state === "granted") {
      report(result.state);
    //   geoBtn.style.display = "none";

      navigator.geolocation.getCurrentPosition(
        revealPosition,
        // positionDenied,
        // geoSettings,
      );
    } else if (result.state === "prompt") {
      report(result.state);
    //   geoBtn.style.display = "none";
      navigator.geolocation.getCurrentPosition(
        revealPosition,
        // positionDenied,
        // geoSettings,
      );
    } else if (result.state === "denied") {
      report(result.state);
    //   geoBtn.style.display = "inline";
    }
    result.addEventListener("change", () => {
      report(result.state);
    });
  });
}

function report(state) {
  console.log(`Permission ${state}`);
}


function init(){
    console.log("ready");
    // handlePermission();   
}





async function initServiceWorker() {
    if ('serviceWorker' in navigator) {
        console.log("registering service worker...")
        swRegistration = await navigator.serviceWorker.register('/sw.js');
        console.log("registered")
    } else {
        console.warn('Service worker is not supported');
    }
}

window.addEventListener('load', () => {
    initServiceWorker();
    init();
});

let myMap;
let canvas;
let mappa = new Mappa('Leaflet');
let id;
let currLat = 0;
let currLon = 0;
let me;
let coinImg;
let coins = [];
let coinsPos = [
  {lat: 31.206291276060323, lng: 121.43136978149415},
  {lat: 31.207250497256478, lng: 121.43132686614992},
  {lat: 31.208149776215084, lng: 121.43124103546144}, 
  {lat: 31.208535178865464, lng: 121.43212080001832}, 
  {lat: 31.208516826393932, lng: 121.43297910690309}, 
  {lat: 31.207672608852896, lng: 121.4331078529358}, 
  {lat: 31.206241092321875, lng: 121.43340826034547}, 
  {lat: 31.205378501387028, lng: 121.43306493759157},
  {lat: 31.21070249807178, lng: 121.41803959837492},
  {lat: 31.210161111071248, lng: 121.41835609903866},
  {lat: 31.210986954406266, lng: 121.41878525248104},
];
let coinsFound = 0;

let confettis = [];


function preload(){
  coinImg = loadImage("coin.gif");
}
function setup(){
    canvas = createCanvas(windowWidth, windowWidth+200);
    me = new MyPoint();
    colorMode(HSB)
    // coins()
}


function pxForMeters(meters, lat){
  z = myMap.zoom();
  const mpp = 156543.03392 * Math.cos(lat*Math.PI/180) / Math.pow(2, z); // meters/pixel
  return meters / mpp;
}


function draw(){
    // background(220);
    // circle(mouseX, mouseY, 5)
    clear();
    me.update();
    me.display();

    for(let i = 0; i < coins.length; i++){
      coins[i].update();
      coins[i].display();
    }

    for(let i = 0; i < confettis.length; i++){
      confettis[i].update();
      confettis[i].display();
      confettis[i].checkOnScreen();
    }


    //DEBUG!!
    // if(myMap!=undefined){
    //   mousePos = myMap.pixelToLatLng(mouseX, mouseY)
    //   currLat = mousePos.lat;
    //   currLon = mousePos.lng;
    //   drawPoint();
    //   checkCoinDistances();
    // }
}

class Coin{
  constructor(lat, lon){
    this.lat = lat;
    this.lon = lon;
    
    this.found = false;
  }
  update(){
    let la = myMap.latLngToPixel(this.lat, this.lon);
    this.x = la.x;
    this.y = la.y;
    // if(random()<0.001 && this.found == false){
    //   this.triggerFound();
    // }
  }
  display(){
    push();

    translate(this.x, this.y);
    // scale(0.1)
    if(this.found == false){
      let dia = pxForMeters(30, this.lat)
      image(coinImg, -dia/2, -dia/2, dia, dia)
    }
    
    // fill("red")
    
    // const z = myMap.zoom(), z0 = 12, basePx = 20;
    // const sizePx = basePx * Math.pow(2, z - z0);
    // circle(0, 0, dia)

    pop();
  }
  triggerFound(){
    this.found = true;
    for(let i = 0; i < 100; i++){
      confettis.push( new Confetti(this.x, this.y) )
    }
    // confettis.push(new Confetti(this.x, this.y))
  }
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

function revealPosition(pos){
  console.log(pos);
  document.querySelector("#getGeoBtn").style.display = "none";
  document.querySelector("#reloadBtn").style.display = "none";

  // let lat = pos.coords.latitude;
  // let lon = pos.coords.longitude;
  const [lon, lat ] = wgs84togcj02(pos.coords.longitude, pos.coords.latitude);

  let options = {
    lat: lat,
    lng: lon, 
    zoom: 16,
    // style: "https://b.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png"
    // style: "https://webrd01.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=7&x={x}&y={y}&z={z}",
    style: 'https://webst01.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=6&x={x}&y={y}&z={z}',
  }
  myMap = mappa.tileMap(options); 
  myMap.overlay(canvas)
  
  
  myMap.onChange(drawPoint);

  
  for(let i = 0; i < coinsPos.length; i++){
    coins.push( new Coin( coinsPos[i].lat, coinsPos[i].lng ) )
  }


  options = {
    enableHighAccuracy: false,
    timeout: 5000,
    maximumAge: 0,
  };

  function error(err) {
    console.error(`ERROR(${err.code}): ${err.message}`);
  }
  id = navigator.geolocation.watchPosition(newPosition, error, options);
  // setTimeout(startLoop, 100);

}

// function startLoop(){
//   setInterval(markPosition, 2000)
 
// }

function newPosition(pos){

  console.log("new position", pos)
  // navigator.geolocation.getCurrentPosition(
  //       function(pos){
  if(pos == undefined) return;
  
    let lat = pos.coords.latitude;
    let lon = pos.coords.longitude; 
    [currLon, currLat] = wgs84togcj02(lon, lat);

  
drawPoint();
checkCoinDistances();
 
  //       }
  // );
}

function drawPoint(){
 // let la = myMap.latLngToPixel(lat, lon);
//  clear();
  let la = myMap.latLngToPixel(currLat, currLon);
  console.log(currLat, currLon)

  // fill(0,255,0);
  // noStroke();
  // circle(la.x, la.y, 10);
  me.goalX = la.x;
  me.goalY = la.y;
}

function mousePressed(){
  // console.log(mouseX, mouseY);
  // console.log(myMap.pixelToLatLng(mouseX, mouseY))
  checkCoinDistances();
}

function checkCoinDistances(){
  let str = ""
  for(let i = 0; i < coins.length; i++){
    const d = myMap.map.distance([currLat, currLon], [coins[i].lat, coins[i].lon]);
    console.log(d)
    str += floor(d) + " , "
    if(d < 10 && coins[i].found == false){
      coins[i].triggerFound();
      coinsFound++;
      document.querySelector("#counter").innerText = "Coins collected: " + coinsFound;
    }
  }
  document.querySelector("#dists").innerText = str;
}


// GAODE and TENCENT maps map pooints didfferent here is conversion (from chatGPT)
// WGS-84 → GCJ-02 (skip if outside CN bbox)
function wgs84togcj02(lng, lat){
  if (outOfChina(lng, lat)) return [lng, lat];
  const a = 6378245.0, ee = 0.00669342162296594323;
  let dLat = transformLat(lng-105.0, lat-35.0);
  let dLng = transformLng(lng-105.0, lat-35.0);
  const radLat = lat/180*Math.PI;
  let magic = 1 - ee*Math.sin(radLat)**2;
  const sqrtMagic = Math.sqrt(magic);
  dLat = (dLat*180)/((a*(1-ee))/(magic*sqrtMagic)*Math.PI);
  dLng = (dLng*180)/(a/ sqrtMagic * Math.cos(radLat)*Math.PI);
  return [lng + dLng, lat + dLat];
}
function outOfChina(lng, lat){
  return (lng < 72.004 || lng > 137.8347 || lat < 0.8293 || lat > 55.8271);
}
function transformLat(x, y){
  let ret = -100.0+2.0*x+3.0*y+0.2*y*y+0.1*x*y+0.2*Math.sqrt(Math.abs(x));
  ret += (20.0*Math.sin(6.0*x*Math.PI)+20.0*Math.sin(2.0*x*Math.PI))*2.0/3.0;
  ret += (20.0*Math.sin(y*Math.PI)+40.0*Math.sin(y/3.0*Math.PI))*2.0/3.0;
  ret += (160.0*Math.sin(y/12.0*Math.PI)+320*Math.sin(y*Math.PI/30.0))*2.0/3.0;
  return ret;
}
function transformLng(x, y){
  let ret = 300.0+x+2.0*y+0.1*x*x+0.1*x*y+0.1*Math.sqrt(Math.abs(x));
  ret += (20.0*Math.sin(6.0*x*Math.PI)+20.0*Math.sin(2.0*x*Math.PI))*2.0/3.0;
  ret += (20.0*Math.sin(x*Math.PI)+40.0*Math.sin(x/3.0*Math.PI))*2.0/3.0;
  ret += (150.0*Math.sin(x/12.0*Math.PI)+300.0*Math.sin(x/30.0*Math.PI))*2.0/3.0;
  return ret;
}

class Confetti{
  constructor(startX, startY){
    this.x = startX;
    this.y = startY;
    this.size = random(2, 10);
    
    this.speedX = random(-2, 2);
    this.speedY = random(-1, -3);

    this.c = color(random(360), 255, 255)
    
    this.onScreen = true;
  }
  update(){
    this.x+=this.speedX;
    this.speedX *= 0.99;
   
    this.y+=this.speedY;
    this.speedY += 0.1;
  }
  display(){    
    push();
    translate(this.x, this.y);

      fill(this.c);
      noStroke();
      circle(0, 0, this.size);
   
    pop();
  }
  checkOnScreen(){
    if(this.y > height){
      this.onScreen = false;
    }
  }

}