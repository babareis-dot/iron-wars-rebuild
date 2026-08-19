const A="../assets/";
export class Game{
constructor(canvas,mini){
 this.c=canvas;this.x=canvas.getContext("2d");this.m=mini;this.mx=mini.getContext("2d");
 this.dpr=Math.min(devicePixelRatio||1,1.25);this.cam={x:0,y:0,z:.82};this.drag=null;this.images={};
 this.resources=JSON.parse(localStorage.getItem("iw_demo_res")||'{"Para":0,"Fuel":50000,"Çelik":100000,"Bakır":100000,"Altın":25000}');
 this.levels=JSON.parse(localStorage.getItem("iw_demo_levels")||'{"HQ":1,"Çelik Fabrikası":1,"Bakır Fabrikası":1,"Fuel Tesisi":1,"Radar":1,"Araç Merkezi":1}');
 this.t=0;this.selectedEnemy=null;this.fx=[];this.projectiles=[];this.tanks=[];this.patrols=[];this.attackActive=false;
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
 this.enemies=[
   {id:1,name:"RAIDER-17",x:720,y:-360,hp:100,max:100,color:"#7a3f33"},
   {id:2,name:"BLACK FOX",x:-820,y:420,hp:100,max:100,color:"#5a4640"},
   {id:3,name:"NORTH BASE",x:920,y:520,hp:100,max:100,color:"#65403b"}
 ];
 for(let i=0;i<5;i++)this.tanks.push({x:-120+i*58,y:135+((i%2)*25),a:0,phase:i*.8});
 for(let i=0;i<3;i++)this.patrols.push({x:-300+i*300,y:-250+i*140,phase:i*2.1});
 this.load();this.bind();this.resize();this.setupCombat();
}
load(){let files=["terrain/grass_field.jpg","terrain/dirt.jpg","terrain/forest_rocks.png","buildings/hq.png","buildings/steel.png","buildings/copper.png","buildings/fuel.png","buildings/factory.png","buildings/radar.png","buildings/vehicle.png","buildings/missile.png","buildings/flag.png","units/hammer.png","units/tanks/tank_mk4.png","units/tanks/tank_mk6.png"];for(let f of files){let i=new Image;i.src=A+f;this.images[f]=i}}
save(){localStorage.setItem("iw_demo_res",JSON.stringify(this.resources));localStorage.setItem("iw_demo_levels",JSON.stringify(this.levels))}
renderResources(){let ic={Para:"💵",Fuel:"🛢️","Çelik":"🔩","Bakır":"🟫","Altın":"🪙"};resources.innerHTML=Object.entries(this.resources).map(([k,v])=>`<div class=res>${ic[k]} <b>${Math.floor(v).toLocaleString("tr-TR")}</b><small>${k}</small></div>`).join("")}
resize(){let r=this.c.parentElement.getBoundingClientRect();this.c.width=r.width*this.dpr;this.c.height=r.height*this.dpr;this.c.style.width=r.width+"px";this.c.style.height=r.height+"px"}
bind(){addEventListener("resize",()=>this.resize());this.c.addEventListener("pointerdown",e=>{this.c.setPointerCapture(e.pointerId);this.drag={x:e.clientX,y:e.clientY,cx:this.cam.x,cy:this.cam.y,m:false}});
this.c.addEventListener("pointermove",e=>{if(!this.drag)return;let dx=e.clientX-this.drag.x,dy=e.clientY-this.drag.y;if(Math.abs(dx)+Math.abs(dy)>7)this.drag.m=true;this.cam.x=this.drag.cx+dx;this.cam.y=this.drag.cy+dy});
this.c.addEventListener("pointerup",e=>{if(this.drag&&!this.drag.m)this.pick(e);this.drag=null});this.c.addEventListener("wheel",e=>{e.preventDefault();this.cam.z=Math.max(.5,Math.min(1.6,this.cam.z-e.deltaY*.001))},{passive:false})}
setupCombat(){let btn=document.getElementById("attackBtn");btn.onclick=()=>this.attackSelected()}
toWorld(e){let r=this.c.getBoundingClientRect();return{x:(e.clientX-r.left-r.width/2-this.cam.x)/this.cam.z,y:(e.clientY-r.top-r.height/2-this.cam.y)/this.cam.z}}
pick(e){let p=this.toWorld(e);
 let enemy=this.enemies.find(q=>Math.hypot(p.x-q.x,p.y-q.y)<120);
 if(enemy){this.selectedEnemy=enemy;combatText.textContent=`${enemy.name} seçildi • Can ${Math.ceil(enemy.hp)}%`;attackBtn.disabled=false;return}
 let b=this.buildings.find(b=>Math.abs(p.x-b.x)<145&&Math.abs(p.y-b.y)<95);if(b)this.openPanel(b)}
openPanel(b){let lv=this.levels[b.n]||1,cost=lv==1?50000:lv==2?100000:300000*(lv-1),rate={Çelik:2500,Bakır:2500,Fuel:1500}[b.type]||0;rate=Math.round(rate*(1+(lv-1)*.6));
 panel.classList.remove("hidden");panel.innerHTML=`<h2>${b.n}</h2><div>Seviye ${lv} / 25</div><div class=panel-grid><div><small>ÜRETİM</small><b>${rate?`+${rate.toLocaleString("tr-TR")}/sn`:"—"}</b></div><div><small>GELİŞTİRME</small><b>${cost.toLocaleString("tr-TR")} Bakır</b></div></div><div class=actions><button id=prod>${rate?"ÜRET • 01:00":"ÜRETİM YOK"}</button><button id=up>GELİŞTİR</button></div><button id=close style="width:100%;margin-top:8px;padding:9px">KAPAT</button>`;
 close.onclick=()=>panel.classList.add("hidden");up.onclick=()=>{if(lv>=25)return;if(this.resources.Bakır<cost)return alert("Yeterli Bakır yok");this.resources.Bakır-=cost;this.levels[b.n]=lv+1;this.save();this.renderResources();panel.classList.add("hidden")};
 prod.onclick=()=>{if(!rate)return;this.production(b.type,rate)}}
production(type,rate){let sec=60;panel.innerHTML=`<h2>${type} üretimi</h2><h1 id=ct>01:00</h1><p>Her saniye +${rate.toLocaleString("tr-TR")}</p>`;let t=setInterval(()=>{this.resources[type]+=rate;sec--;this.renderResources();this.save();ct.textContent=`00:${String(sec).padStart(2,"0")}`;if(sec<=0){clearInterval(t);panel.classList.add("hidden")}},1000)}
attackSelected(){if(!this.selectedEnemy||this.attackActive)return;this.attackActive=true;attackBtn.disabled=true;combatText.textContent=`${this.selectedEnemy.name} hedefine saldırı başladı...`;
 for(let i=0;i<this.tanks.length;i++){let t=this.tanks[i];t.attackTarget=this.selectedEnemy;t.attackDelay=i*20}
}
img(n,x,y,w,h,a=0){let i=this.images[n];if(i?.complete){this.x.save();this.x.translate(x,y);this.x.rotate(a);this.x.drawImage(i,-w/2,-h/2,w,h);this.x.restore()}}
drawBase(){
 let x=this.x,dirt=this.images["terrain/dirt.jpg"];if(dirt?.complete){let p=x.createPattern(dirt,"repeat");x.fillStyle=p;x.beginPath();x.ellipse(0,20,370,260,0,0,7);x.fill()}
 let fr=this.images["terrain/forest_rocks.png"];if(fr?.complete){x.globalAlpha=.95;x.drawImage(fr,-430,-310,860,430);x.globalAlpha=1}
 x.fillStyle="#4d5149";x.fillRect(-62,40,124,240);x.fillStyle="#2f3432";x.fillRect(-6,40,12,240);
 for(let b of this.buildings){let lv=this.levels[b.n]||1,s=1+Math.min(24,lv-1)*.022;this.img("buildings/"+b.s,b.x,b.y,280*s,186*s)}
 this.img("buildings/flag.png",-75,-185,76,118);this.img("buildings/flag.png",75,-185,76,118);
 for(let m of this.missiles)this.img("buildings/missile.png",m.x,m.y,54,84);
 this.img("units/hammer.png",0,145,105,63);
}
drawEnemyBase(e){
 let x=this.x;x.save();x.translate(e.x,e.y);
 x.fillStyle="#6e6847";x.beginPath();x.ellipse(0,0,150,105,0,0,7);x.fill();
 x.fillStyle=e.color;x.fillRect(-42,-28,84,56);x.fillStyle="#2b302d";x.fillRect(-25,-52,50,26);
 for(let i=0;i<4;i++){x.fillStyle="#3d443d";x.fillRect(-110+i*70,50,22,38)}
 x.fillStyle="#071015dc";x.fillRect(-75,-105,150,26);x.fillStyle="#fff";x.font="12px Arial";x.textAlign="center";x.fillText(e.name,0,-88);
 x.fillStyle="#151b19";x.fillRect(-80,-72,160,10);x.fillStyle=e.hp>40?"#58b45b":"#cf5548";x.fillRect(-80,-72,160*(e.hp/e.max),10);
 if(this.selectedEnemy===e){x.strokeStyle="#f2c85c";x.lineWidth=4;x.beginPath();x.ellipse(0,0,170,122,0,0,7);x.stroke()}
 x.restore()
}
updateCombat(){
 this.t++;
 for(let p of this.patrols){p.x+=Math.sin(this.t*.012+p.phase)*.4;p.y+=Math.cos(this.t*.01+p.phase)*.25}
 for(let tank of this.tanks){
   if(tank.attackTarget){
     if(tank.attackDelay>0){tank.attackDelay--;continue}
     let dx=tank.attackTarget.x-tank.x,dy=tank.attackTarget.y-tank.y,dist=Math.hypot(dx,dy);
     tank.a=Math.atan2(dy,dx);
     if(dist>170){tank.x+=dx/dist*1.25;tank.y+=dy/dist*1.25}
     else if(this.t%35===0){this.projectiles.push({x:tank.x,y:tank.y,tx:tank.attackTarget.x,ty:tank.attackTarget.y,p:0,target:tank.attackTarget})}
   }
 }
 for(let pr of this.projectiles){pr.p+=.08;if(pr.p>=1&&!pr.done){pr.done=true;pr.target.hp=Math.max(0,pr.target.hp-6);this.fx.push({x:pr.target.x+(Math.random()-.5)*70,y:pr.target.y+(Math.random()-.5)*45,life:28});combatText.textContent=`${pr.target.name} • Can ${Math.ceil(pr.target.hp)}%`;if(pr.target.hp<=0){combatText.textContent=`${pr.target.name} yok edildi! Demo saldırısı tamamlandı.`;this.attackActive=false;this.selectedEnemy=null;for(let t of this.tanks)delete t.attackTarget}}}
 this.projectiles=this.projectiles.filter(p=>!p.done);
 for(let f of this.fx)f.life--;this.fx=this.fx.filter(f=>f.life>0)
}
drawUnits(){
 for(let p of this.patrols)this.img("units/hammer.png",p.x,p.y,92,54,Math.sin(this.t*.01+p.phase)*.2);
 for(let t of this.tanks)this.img("units/tanks/tank_mk4.png",t.x,t.y,96,60,t.a);
 for(let pr of this.projectiles){let x=pr.x+(pr.tx-pr.x)*pr.p,y=pr.y+(pr.ty-pr.y)*pr.p;this.x.fillStyle="#ffd36b";this.x.beginPath();this.x.arc(x,y,4,0,7);this.x.fill()}
 for(let f of this.fx){let r=(28-f.life)*2.1;this.x.fillStyle=`rgba(255,125,45,${f.life/28})`;this.x.beginPath();this.x.arc(f.x,f.y,r,0,7);this.x.fill();this.x.fillStyle=`rgba(55,55,50,${f.life/40})`;this.x.beginPath();this.x.arc(f.x+8,f.y-r*.6,r*.7,0,7);this.x.fill()}
}
draw(){
 this.updateCombat();
 let w=this.c.width/this.dpr,h=this.c.height/this.dpr,x=this.x;x.setTransform(this.dpr,0,0,this.dpr,0,0);x.clearRect(0,0,w,h);
 let g=this.images["terrain/grass_field.jpg"];if(g?.complete){let p=x.createPattern(g,"repeat");x.fillStyle=p;x.fillRect(0,0,w,h)}else{x.fillStyle="#968b59";x.fillRect(0,0,w,h)}
 x.save();x.translate(w/2+this.cam.x,h/2+this.cam.y);x.scale(this.cam.z,this.cam.z);
 // roads to other bases
 x.strokeStyle="rgba(80,76,54,.7)";x.lineWidth=26;for(let e of this.enemies){x.beginPath();x.moveTo(0,0);x.lineTo(e.x,e.y);x.stroke()}
 this.drawBase();for(let e of this.enemies)if(e.hp>0)this.drawEnemyBase(e);this.drawUnits();x.restore();this.drawMini();
 requestAnimationFrame(()=>this.draw())
}
drawMini(){let x=this.mx,w=this.m.width,h=this.m.height;x.clearRect(0,0,w,h);x.fillStyle="#202a1d";x.fillRect(0,0,w,h);
 for(let i=0;i<80;i++){x.fillStyle=i%5?"#59664a":"#897a44";x.fillRect((i*37)%w,(i*61)%h,3,3)}
 x.fillStyle="#f1c754";x.fillRect(w/2-3,h/2-3,6,6);
 for(let e of this.enemies)if(e.hp>0){x.fillStyle="#cf5548";x.fillRect(w/2+e.x/14-2,h/2+e.y/14-2,5,5)}
}
start(){this.renderResources();this.draw()}
}