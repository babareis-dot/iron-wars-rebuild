const A="../assets/";
export class Game{
constructor(canvas,mini){
 this.c=canvas;this.x=canvas.getContext("2d");this.m=mini;this.mx=mini.getContext("2d");
 this.dpr=Math.min(devicePixelRatio||1,1.25);this.cam={x:0,y:0,z:.82};this.drag=null;this.images={};this.ready=0;
 this.resources=JSON.parse(localStorage.getItem("iw_demo_res")||'{"Para":0,"Fuel":50000,"Çelik":100000,"Bakır":100000,"Altın":25000}');
 this.levels=JSON.parse(localStorage.getItem("iw_demo_levels")||'{"HQ":1,"Çelik Fabrikası":1,"Bakır Fabrikası":1,"Fuel Tesisi":1,"Radar":1,"Araç Merkezi":1}');
 this.buildings=[
  {n:"HQ",x:0,y:-110,s:"hq.png",type:"none"},
  {n:"Çelik Fabrikası",x:-210,y:-75,s:"steel.png",type:"Çelik"},
  {n:"Bakır Fabrikası",x:210,y:-70,s:"copper.png",type:"Bakır"},
  {n:"Fuel Tesisi",x:-210,y:75,s:"fuel.png",type:"Fuel"},
  {n:"Radar",x:205,y:80,s:"radar.png",type:"none"},
  {n:"Araç Merkezi",x:0,y:80,s:"vehicle.png",type:"none"},
  {n:"Fabrika A",x:-100,y:20,s:"factory.png",type:"none"},
  {n:"Fabrika B",x:100,y:22,s:"factory.png",type:"none"}];
 this.missiles=[];for(let r=0;r<2;r++)for(let i=0;i<9;i++)this.missiles.push({x:-244+i*61,y:210+r*66});
 this.load();this.bind();this.resize();
}
load(){let files=["terrain/grass_field.jpg","terrain/dirt.jpg","terrain/forest_rocks.png","buildings/hq.png","buildings/steel.png","buildings/copper.png","buildings/fuel.png","buildings/factory.png","buildings/radar.png","buildings/vehicle.png","buildings/missile.png","buildings/flag.png","units/hammer.png"];for(let f of files){let i=new Image;i.src=A+f;i.onload=()=>this.ready++;this.images[f]=i}}
save(){localStorage.setItem("iw_demo_res",JSON.stringify(this.resources));localStorage.setItem("iw_demo_levels",JSON.stringify(this.levels))}
renderResources(){let ic={Para:"💵",Fuel:"🛢️","Çelik":"🔩","Bakır":"🟫","Altın":"🪙"};resources.innerHTML=Object.entries(this.resources).map(([k,v])=>`<div class=res>${ic[k]} <b>${Math.floor(v).toLocaleString("tr-TR")}</b><small>${k}</small></div>`).join("")}
resize(){let r=this.c.parentElement.getBoundingClientRect();this.c.width=r.width*this.dpr;this.c.height=r.height*this.dpr;this.c.style.width=r.width+"px";this.c.style.height=r.height+"px"}
bind(){addEventListener("resize",()=>this.resize());this.c.addEventListener("pointerdown",e=>{this.c.setPointerCapture(e.pointerId);this.drag={x:e.clientX,y:e.clientY,cx:this.cam.x,cy:this.cam.y,m:false}});
this.c.addEventListener("pointermove",e=>{if(!this.drag)return;let dx=e.clientX-this.drag.x,dy=e.clientY-this.drag.y;if(Math.abs(dx)+Math.abs(dy)>7)this.drag.m=true;this.cam.x=this.drag.cx+dx;this.cam.y=this.drag.cy+dy});
this.c.addEventListener("pointerup",e=>{if(this.drag&&!this.drag.m)this.pick(e);this.drag=null});this.c.addEventListener("wheel",e=>{e.preventDefault();this.cam.z=Math.max(.55,Math.min(1.5,this.cam.z-e.deltaY*.001))},{passive:false})}
toWorld(e){let r=this.c.getBoundingClientRect();return{x:(e.clientX-r.left-r.width/2-this.cam.x)/this.cam.z,y:(e.clientY-r.top-r.height/2-this.cam.y)/this.cam.z}}
pick(e){let p=this.toWorld(e),b=this.buildings.find(b=>Math.abs(p.x-b.x)<145&&Math.abs(p.y-b.y)<95);if(b)this.openPanel(b)}
openPanel(b){let lv=this.levels[b.n]||1,cost=lv==1?50000:lv==2?100000:300000*(lv-1),rate={Çelik:2500,Bakır:2500,Fuel:1500}[b.type]||0;rate=Math.round(rate*(1+(lv-1)*.6));
 panel.classList.remove("hidden");panel.innerHTML=`<h2>${b.n}</h2><div>Seviye ${lv} / 25</div><div class=panel-grid><div><small>ÜRETİM</small><b>${rate?`+${rate.toLocaleString("tr-TR")}/sn`:"—"}</b></div><div><small>GELİŞTİRME</small><b>${cost.toLocaleString("tr-TR")} Bakır</b></div></div><div class=actions><button id=prod>${rate?"ÜRET • 01:00":"ÜRETİM YOK"}</button><button id=up>GELİŞTİR</button></div><button id=close style="width:100%;margin-top:8px;padding:9px">KAPAT</button>`;
 close.onclick=()=>panel.classList.add("hidden");up.onclick=()=>{if(lv>=25)return;if(this.resources.Bakır<cost)return alert("Yeterli Bakır yok");this.resources.Bakır-=cost;this.levels[b.n]=lv+1;this.save();this.renderResources();panel.classList.add("hidden")};
 prod.onclick=()=>{if(!rate)return;this.production(b.type,rate)}}
production(type,rate){let sec=60;panel.innerHTML=`<h2>${type} üretimi</h2><h1 id=ct>01:00</h1><p>Her saniye +${rate.toLocaleString("tr-TR")}</p>`;let t=setInterval(()=>{this.resources[type]+=rate;sec--;this.renderResources();this.save();ct.textContent=`00:${String(sec).padStart(2,"0")}`;if(sec<=0){clearInterval(t);panel.classList.add("hidden")}},1000)}
img(n,x,y,w,h){let i=this.images[n];if(i?.complete)this.x.drawImage(i,x-w/2,y-h/2,w,h)}
drawBase(){
 let x=this.x;
 // inner base dirt
 let dirt=this.images["terrain/dirt.jpg"];if(dirt?.complete){let p=x.createPattern(dirt,"repeat");x.fillStyle=p;x.beginPath();x.ellipse(0,20,370,260,0,0,7);x.fill()}
 // perimeter trees and rocks from strip
 let fr=this.images["terrain/forest_rocks.png"];if(fr?.complete){x.globalAlpha=.95;x.drawImage(fr,-430,-310,860,430);x.globalAlpha=1}
 // vehicle road
 x.fillStyle="#4d5149";x.fillRect(-62,40,124,240);x.fillStyle="#2f3432";x.fillRect(-6,40,12,240);
 // building sprites scale by level
 for(let b of this.buildings){let lv=this.levels[b.n]||1,s=1+Math.min(24,lv-1)*.022;this.img("buildings/"+b.s,b.x,b.y,280*s,186*s)}
 this.img("buildings/flag.png",-75,-185,76,118);this.img("buildings/flag.png",75,-185,76,118);
 for(let m of this.missiles)this.img("buildings/missile.png",m.x,m.y,54,84);
 this.img("units/hammer.png",0,145,105,63)
}
draw(){
 let w=this.c.width/this.dpr,h=this.c.height/this.dpr;x=this.x;x.setTransform(this.dpr,0,0,this.dpr,0,0);x.clearRect(0,0,w,h);
 let g=this.images["terrain/grass_field.jpg"];if(g?.complete){let p=x.createPattern(g,"repeat");x.fillStyle=p;x.fillRect(0,0,w,h)}else{x.fillStyle="#968b59";x.fillRect(0,0,w,h)}
 x.save();x.translate(w/2+this.cam.x,h/2+this.cam.y);x.scale(this.cam.z,this.cam.z);this.drawBase();x.restore();this.drawMini();requestAnimationFrame(()=>this.draw())}
drawMini(){let x=this.mx,w=this.m.width,h=this.m.height;x.clearRect(0,0,w,h);x.fillStyle="#202a1d";x.fillRect(0,0,w,h);for(let i=0;i<80;i++){x.fillStyle=i%5?"#59664a":"#897a44";x.fillRect((i*37)%w,(i*61)%h,3,3)}x.fillStyle="#f1c754";x.fillRect(w/2-3,h/2-3,6,6)}
start(){this.renderResources();this.draw()}
}