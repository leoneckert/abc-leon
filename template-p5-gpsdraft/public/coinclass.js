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
