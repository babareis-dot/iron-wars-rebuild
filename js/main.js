import {Game} from "./rts.js";
const game=new Game(document.getElementById("world"),document.getElementById("mini"));
game.start();
document.getElementById("fullscreen").onclick=async()=>{try{if(!document.fullscreenElement){await document.documentElement.requestFullscreen();try{await screen.orientation.lock("landscape")}catch{}}else await document.exitFullscreen()}catch{}};
