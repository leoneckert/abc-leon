// Check if the PWA is in 'standalone' mode
const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
 
// Check for 'fullscreen' mode
const isFullscreen = window.matchMedia('(display-mode: fullscreen)').matches;
 
// Check for 'minimal-ui' mode
const isMinimalUI = window.matchMedia('(display-mode: minimal-ui)').matches;
 
// App mode if any of these are true
const isLaunchedAsApp = isStandalone || isFullscreen || isMinimalUI;

if(isLaunchedAsApp){
    document.querySelector("#status p").innerText = "-> YES";
    let js = document.createElement("script");
    js.src = "script.js";
    document.head.append(js);
}else{
    document.querySelector("#status p").innerText = "-> NO.";

}
