console.log("IRON WARS REBUILD v2.1 loaded");
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const canvas=document.getElementById('scene');
const renderer=new THREE.WebGLRenderer({canvas,antialias:true,powerPreference:'high-performance'});
renderer.setPixelRatio(Math.min(devicePixelRatio,1.6));
renderer.shadowMap.enabled=true;
renderer.shadowMap.type=THREE.PCFSoftShadowMap;
renderer.outputColorSpace=THREE.SRGBColorSpace;

const scene=new THREE.Scene();
scene.background=new THREE.Color(0x172832);
scene.fog=new THREE.FogExp2(0x233b45,0.010);

const camera=new THREE.PerspectiveCamera(48,1,0.1,500);
camera.position.set(34,30,40);

const controls=new OrbitControls(camera,renderer.domElement);
controls.target.set(0,0,0);
controls.enableDamping=true;
controls.dampingFactor=.06;
controls.minDistance=24;
controls.maxDistance=62;
controls.maxPolarAngle=Math.PI*.48;
controls.minPolarAngle=Math.PI*.20;
controls.enablePan=true;
controls.screenSpacePanning=false;

const hemi=new THREE.HemisphereLight(0x8eb9ce,0x17231c,1.15);scene.add(hemi);
const sun=new THREE.DirectionalLight(0xffd9a3,2.35);sun.position.set(-20,35,12);sun.castShadow=true;
sun.shadow.mapSize.set(2048,2048);sun.shadow.camera.left=-45;sun.shadow.camera.right=45;sun.shadow.camera.top=45;sun.shadow.camera.bottom=-45;scene.add(sun);

const seaMat=new THREE.MeshStandardMaterial({color:0x24596d,roughness:.3,metalness:.15,transparent:true,opacity:.96});
const seaGeo=new THREE.PlaneGeometry(180,180,48,48);
const sea=new THREE.Mesh(seaGeo,seaMat);sea.rotation.x=-Math.PI/2;sea.position.y=-1.6;scene.add(sea);

const island=new THREE.Mesh(new THREE.CylinderGeometry(28,34,3.4,8),new THREE.MeshStandardMaterial({color:0x526448,roughness:1}));
island.position.y=-.2;island.receiveShadow=true;scene.add(island);

const roadMat=new THREE.MeshStandardMaterial({color:0x2b3235,roughness:.95});
function road(x,z,w,d,rot=0){
 const m=new THREE.Mesh(new THREE.BoxGeometry(w,.18,d),roadMat);m.position.set(x,1.58,z);m.rotation.y=rot;m.receiveShadow=true;scene.add(m);return m;
}
road(0,0,44,5);road(0,0,5,36);road(-10,-8,18,4,.25);road(12,9,20,4,-.2);

const buildingMat=new THREE.MeshStandardMaterial({color:0x717c80,roughness:.72,metalness:.15});
const darkMat=new THREE.MeshStandardMaterial({color:0x333c42,roughness:.8,metalness:.1});
const glowMat=new THREE.MeshStandardMaterial({color:0xffa742,emissive:0xff6a00,emissiveIntensity:2.2});
const buildings=[];

function addBuilding(id,name,x,z,w,d,h,resource=null){
 const group=new THREE.Group();group.position.set(x,1.7,z);group.userData={id,name,resource};
 const base=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),buildingMat);base.position.y=h/2;base.castShadow=true;base.receiveShadow=true;group.add(base);
 const roof=new THREE.Mesh(new THREE.BoxGeometry(w*.72,.45,d*.72),darkMat);roof.position.y=h+.22;roof.castShadow=true;group.add(roof);
 for(let i=0;i<3;i++){const lamp=new THREE.Mesh(new THREE.BoxGeometry(.22,.22,.08),glowMat);lamp.position.set(-w*.28+i*w*.28,h*.56,d/2+.05);group.add(lamp)}
 const ring=new THREE.Mesh(new THREE.RingGeometry(Math.max(w,d)*.62,Math.max(w,d)*.72,32),new THREE.MeshBasicMaterial({color:0xf0c55c,transparent:true,opacity:0,side:THREE.DoubleSide}));
 ring.rotation.x=-Math.PI/2;ring.position.y=.04;group.add(ring);group.userData.ring=ring;
 scene.add(group);buildings.push(group);return group;
}
addBuilding('hq','Komuta Merkezi',0,-1,7,6,6,null);
addBuilding('steel','Çelik Fabrikası',-12,7,7,5,4,'steel');
addBuilding('fuel','Yakıt Rafinerisi',-14,-6,5,5,4,'oil');
addBuilding('copper','Bakır Tesisi',10,8,6,5,4,'copper');
addBuilding('gold','Altın Rafinerisi',10,-6,4,4,5,'gold');
addBuilding('tank','Tank Üretim Merkezi',-3,10,8,5,4,null);
addBuilding('air','Hava Üssü',14,1,8,6,3,null);
addBuilding('dock','Tersane',17,11,8,5,3,null);
// v2: procedural military details — all separate 3D objects
const metal=new THREE.MeshStandardMaterial({color:0x38454b,roughness:.55,metalness:.55});
const concrete=new THREE.MeshStandardMaterial({color:0x5d6868,roughness:.92});
const redGlow=new THREE.MeshStandardMaterial({color:0xff3b22,emissive:0xff1600,emissiveIntensity:3});
const amberGlow=new THREE.MeshStandardMaterial({color:0xffbd58,emissive:0xff7a00,emissiveIntensity:2});

function tower(x,z,h=8){
 const g=new THREE.Group();g.position.set(x,1.65,z);
 const shaft=new THREE.Mesh(new THREE.CylinderGeometry(.28,.42,h,8),metal);shaft.position.y=h/2;shaft.castShadow=true;g.add(shaft);
 for(let y=1.2;y<h;y+=1.4){const ring=new THREE.Mesh(new THREE.TorusGeometry(.52,.055,6,16),metal);ring.rotation.x=Math.PI/2;ring.position.y=y;g.add(ring)}
 const beacon=new THREE.Mesh(new THREE.SphereGeometry(.16,10,10),redGlow);beacon.position.y=h+.25;g.add(beacon);g.userData.beacon=beacon;scene.add(g);return g;
}
const towers=[tower(2,-2,9),tower(-17,5,7),tower(13,-8,6)];

function radar(x,z){
 const g=new THREE.Group();g.position.set(x,2,z);
 const base=new THREE.Mesh(new THREE.CylinderGeometry(1.8,2.2,1.1,24),concrete);base.position.y=.55;g.add(base);
 const dish=new THREE.Mesh(new THREE.SphereGeometry(1.55,24,12,0,Math.PI*2,0,Math.PI*.46),metal);
 dish.scale.y=.35;dish.rotation.x=-.9;dish.position.y=2.25;g.add(dish);g.userData.dish=dish;scene.add(g);return g;
}
const radarUnit=radar(-8,-8);

function hangar(x,z,rot=0){
 const g=new THREE.Group();g.position.set(x,1.7,z);g.rotation.y=rot;
 const b=new THREE.Mesh(new THREE.BoxGeometry(6,2.5,4),metal);b.position.y=1.25;b.castShadow=true;g.add(b);
 const door=new THREE.Mesh(new THREE.BoxGeometry(4.2,1.65,.08),darkMat);door.position.set(0,1.05,2.04);g.add(door);
 for(let i=-1;i<=1;i++){const l=new THREE.Mesh(new THREE.SphereGeometry(.09,8,8),amberGlow);l.position.set(i*1.5,2.25,2.1);g.add(l)}
 scene.add(g);return g;
}
hangar(11,4,.1);hangar(16,5,.1);

function runway(){
 const r=new THREE.Mesh(new THREE.BoxGeometry(18,.12,4.8),new THREE.MeshStandardMaterial({color:0x20272b,roughness:.9}));
 r.position.set(13,1.7,0);r.rotation.y=-.08;scene.add(r);
 for(let i=-7;i<=7;i+=2){const m=new THREE.Mesh(new THREE.BoxGeometry(.8,.04,.12),new THREE.MeshBasicMaterial({color:0xe8d59b}));m.position.set(13+i,1.78,-i*.08);m.rotation.y=-.08;scene.add(m)}
}
runway();

function dockPier(x,z,w,d){
 const p=new THREE.Mesh(new THREE.BoxGeometry(w,.35,d),concrete);p.position.set(x,1.45,z);p.castShadow=true;p.receiveShadow=true;scene.add(p);
}
dockPier(17,15,12,2);dockPier(20,11,2,10);

function lamp(x,z){
 const pole=new THREE.Mesh(new THREE.CylinderGeometry(.04,.06,2.3,6),metal);pole.position.set(x,2.85,z);scene.add(pole);
 const bulb=new THREE.PointLight(0xffb75b,.8,6,2);bulb.position.set(x,4,z);scene.add(bulb);
}
for(let x=-16;x<=16;x+=5){lamp(x,2.8);lamp(x,-2.8)}

function wallSegment(x,z,w,d){
 const m=new THREE.Mesh(new THREE.BoxGeometry(w,1.2,d),concrete);m.position.set(x,2.1,z);m.castShadow=true;scene.add(m);
}
wallSegment(0,-23,38,.6);wallSegment(-22,0,.6,38);wallSegment(22,0,.6,38);

const crates=[];
for(let i=0;i<18;i++){
 const c=new THREE.Mesh(new THREE.BoxGeometry(.7,.7,.7),new THREE.MeshStandardMaterial({color:0x705234,roughness:.9}));
 c.position.set(-5+Math.random()*10,2.05,14+Math.random()*3);c.rotation.y=Math.random()*Math.PI;c.castShadow=true;scene.add(c);crates.push(c);
}


function chimney(parent,ox,oz,h=5){
 const c=new THREE.Mesh(new THREE.CylinderGeometry(.35,.48,h,10),darkMat);c.position.set(ox,h/2+.4,oz);c.castShadow=true;parent.add(c);
}
chimney(buildings.find(b=>b.userData.id==='steel'),-2,0,6);
chimney(buildings.find(b=>b.userData.id==='fuel'),1.4,0,5);

const smokeParticles=[];
function addSmokeEmitter(building){
 const origin=new THREE.Vector3();building.getWorldPosition(origin);origin.y+=7;
 for(let i=0;i<14;i++){
   const mat=new THREE.MeshBasicMaterial({color:0xb8c1c3,transparent:true,opacity:.16,depthWrite:false});
   const p=new THREE.Mesh(new THREE.SphereGeometry(.45,8,8),mat);
   p.position.copy(origin);p.position.y+=i*.55;p.userData={base:origin.clone(),phase:i/14,life:i/14};
   p.scale.setScalar(.5+i*.025);scene.add(p);smokeParticles.push(p);
 }
}
addSmokeEmitter(buildings.find(b=>b.userData.id==='steel'));
addSmokeEmitter(buildings.find(b=>b.userData.id==='fuel'));

function makeTank(){
 const g=new THREE.Group();
 const body=new THREE.Mesh(new THREE.BoxGeometry(2,.65,3.1),new THREE.MeshStandardMaterial({color:0x46533a,roughness:.8}));body.position.y=.55;body.castShadow=true;g.add(body);
 const turret=new THREE.Mesh(new THREE.BoxGeometry(1.3,.45,1.3),darkMat);turret.position.y=1.05;g.add(turret);
 const gun=new THREE.Mesh(new THREE.BoxGeometry(.18,.18,2.1),darkMat);gun.position.set(0,1.08,-1.35);g.add(gun);
 scene.add(g);return g;
}
const tanks=[makeTank(),makeTank(),makeTank()];
tanks[0].position.set(-18,1.8,0);tanks[1].position.set(-5,1.8,8);tanks[2].position.set(16,1.8,-1);

function helicopter(){
 const g=new THREE.Group();
 const body=new THREE.Mesh(new THREE.BoxGeometry(2.6,.8,1.2),new THREE.MeshStandardMaterial({color:0x424a3b}));g.add(body);
 const tail=new THREE.Mesh(new THREE.BoxGeometry(2.3,.18,.18),darkMat);tail.position.x=-2.1;g.add(tail);
 const rotor=new THREE.Mesh(new THREE.BoxGeometry(5.2,.04,.12),darkMat);rotor.position.y=.7;g.add(rotor);g.userData.rotor=rotor;
 scene.add(g);return g;
}
const heli=helicopter();heli.position.set(10,13,-12);

const trees=[];
for(let i=0;i<55;i++){
 const a=Math.random()*Math.PI*2,r=20+Math.random()*6;
 const trunk=new THREE.Mesh(new THREE.CylinderGeometry(.12,.18,1.1,6),new THREE.MeshStandardMaterial({color:0x5c442c}));
 const crown=new THREE.Mesh(new THREE.ConeGeometry(.7,2.2,7),new THREE.MeshStandardMaterial({color:0x2e5434}));
 const g=new THREE.Group();trunk.position.y=.55;crown.position.y=1.7;g.add(trunk,crown);g.position.set(Math.cos(a)*r,1.55,Math.sin(a)*r);scene.add(g);trees.push(g);
}

const raycaster=new THREE.Raycaster(),pointer=new THREE.Vector2();
let selected=null;
const MAX_LEVEL=25;
const defaultState={resources:{money:0,fuel:50000,steel:100000,copper:100000,gold:25000},levels:{steel:1,fuel:1,copper:1,gold:1,hq:1,tank:1,air:1,dock:1},production:{},upgrades:{}};
let state=JSON.parse(localStorage.getItem('ironWarsRebuildV1')||'null')||structuredClone(defaultState);
const rates={steel:[0,2500,4000],fuel:[0,1500,2500],copper:[0,2500,4000],gold:[0,120,200]};
for(const k of Object.keys(rates)){for(let l=3;l<=25;l++)rates[k][l]=Math.round(rates[k][l-1]*1.18)}
const costs={1:50000,2:100000,3:300000};
for(let l=4;l<25;l++)costs[l]=Math.round((costs[l-1]*1.55)/1000)*1000;
const upgradeSeconds={1:15,2:30,3:60};
for(let l=4;l<25;l++)upgradeSeconds[l]=Math.min(43200,Math.round(upgradeSeconds[l-1]*1.55));

const fmt=n=>Math.floor(n).toLocaleString('tr-TR');
function save(){localStorage.setItem('ironWarsRebuildV1',JSON.stringify(state))}
function renderResources(){
 money.textContent=fmt(state.resources.money);fuel.textContent=fmt(state.resources.fuel);steel.textContent=fmt(state.resources.steel);copper.textContent=fmt(state.resources.copper);gold.textContent=fmt(state.resources.gold);
}
function resourceKey(id){return id==='fuel'?'fuel':id}
function levelOf(id){return state.levels[id]||1}
function rateOf(id){const key=resourceKey(id);return rates[key]?.[levelOf(id)]||0}
function selectBuilding(b){
 selected=b;
 buildings.forEach(x=>x.userData.ring.material.opacity=x===b?.3:0);
 if(!b)return;
 const id=b.userData.id,lv=levelOf(id),key=resourceKey(id),rate=rateOf(id);
 panelIcon.textContent=id==='steel'?'🏭':id==='fuel'?'🛢️':id==='copper'?'🟫':id==='gold'?'🪙':'🏢';
 panelTitle.textContent=b.userData.name;
 panelLevel.textContent=`Seviye ${lv} / 25`;
 panelPower.textContent=fmt(1000*lv*1.35);
 panelProduction.textContent=b.userData.resource?`+${fmt(rate)}/sn`:'Askeri bina';
 prodInfo.textContent=b.userData.resource?`1 dakikalık üretim: +${fmt(rate*60)} ${b.userData.name.includes('Çelik')?'Çelik':b.userData.name.includes('Yakıt')?'Fuel':b.userData.name.includes('Bakır')?'Bakır':'Altın'}`:'Bu bina kaynak üretmez.';
 produceBtn.disabled=!b.userData.resource||!!state.production[id]||!!state.upgrades[id];
 produceBtn.textContent=state.production[id]?'ÜRETİM SÜRÜYOR':'ÜRET • 01:00';
 if(lv>=25){upgradeBtn.disabled=true;upgradeBtn.textContent='MAKSİMUM SEVİYE'}else{upgradeBtn.disabled=!!state.upgrades[id]||!!state.production[id];upgradeBtn.textContent=`GELİŞTİR • ${fmt(costs[lv])} BAKIR`}
 panel.classList.remove('hidden');
}
function startProduction(){
 if(!selected||!selected.userData.resource)return;
 const id=selected.userData.id;if(state.production[id])return;
 const now=Date.now();state.production[id]={start:now,end:now+60000,last:Math.floor(now/1000)};save();selectBuilding(selected);
}
function startUpgrade(){
 if(!selected)return;const id=selected.userData.id,lv=levelOf(id);if(lv>=25||state.upgrades[id])return;
 const cost=costs[lv];if(state.resources.copper<cost){toast('Yeterli Bakır yok');return}
 state.resources.copper-=cost;const now=Date.now();state.upgrades[id]={start:now,end:now+upgradeSeconds[lv]*1000,to:lv+1};save();renderResources();selectBuilding(selected);
}
function tickEconomy(){
 const now=Date.now();let dirty=false;
 for(const [id,p] of Object.entries(state.production)){
  const b=buildings.find(x=>x.userData.id===id);if(!b){delete state.production[id];continue}
  const nowSec=Math.floor(Math.min(now,p.end)/1000),due=Math.max(0,nowSec-p.last);
  if(due){const key=resourceKey(id);state.resources[key]+=rateOf(id)*due;p.last+=due;dirty=true}
  if(now>=p.end){delete state.production[id];dirty=true}
 }
 for(const [id,u] of Object.entries(state.upgrades)){
  if(now>=u.end){state.levels[id]=u.to;delete state.upgrades[id];dirty=true}
 }
 if(dirty){save();renderResources();if(selected)selectBuilding(selected)}
 if(selected){
  const id=selected.userData.id,p=state.production[id],u=state.upgrades[id];
  if(p){const left=Math.max(0,p.end-now),pct=1-left/60000;timer.textContent=`Üretim: ${Math.ceil(left/1000)} sn`;progressBar.style.width=(pct*100)+'%'}
  else if(u){const total=u.end-u.start,left=Math.max(0,u.end-now),pct=1-left/total;timer.textContent=`Geliştirme: ${Math.ceil(left/1000)} sn`;progressBar.style.width=(pct*100)+'%'}
  else{timer.textContent='Hazır';progressBar.style.width='0%'}
 }
}
function toast(t){const e=document.getElementById('toast');e.textContent=t;e.classList.add('show');setTimeout(()=>e.classList.remove('show'),1400)}

renderer.domElement.addEventListener('pointerdown',e=>{
 const r=renderer.domElement.getBoundingClientRect();pointer.x=((e.clientX-r.left)/r.width)*2-1;pointer.y=-((e.clientY-r.top)/r.height)*2+1;
 raycaster.setFromCamera(pointer,camera);const hits=raycaster.intersectObjects(buildings,true);
 if(hits.length){let obj=hits[0].object;while(obj.parent&&obj.parent!==scene&&!obj.userData.id)obj=obj.parent;if(obj.userData.id)selectBuilding(obj)}
});

produceBtn.addEventListener('click',startProduction);upgradeBtn.addEventListener('click',startUpgrade);closePanel.addEventListener('click',()=>panel.classList.add('hidden'));
fullscreen.addEventListener('click',async()=>{try{if(!document.fullscreenElement){await document.documentElement.requestFullscreen();try{await screen.orientation.lock('landscape')}catch{}}else await document.exitFullscreen()}catch{}});
startBtn.addEventListener('click',()=>{start.classList.add('hidden')});

function resize(){
 const w=innerWidth,h=innerHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();
}
addEventListener('resize',resize);resize();renderResources();setInterval(tickEconomy,250);

const clock=new THREE.Clock();
function animate(){
 requestAnimationFrame(animate);
 const t=clock.getElapsedTime();
 const pos=sea.geometry.attributes.position;
 for(let i=0;i<pos.count;i++){const x=pos.getX(i),y=pos.getY(i);pos.setZ(i,Math.sin(x*.12+t)*.18+Math.cos(y*.1+t*.8)*.12)}
 pos.needsUpdate=true;sea.geometry.computeVertexNormals();
 smokeParticles.forEach((p,i)=>{p.userData.life=(p.userData.life+.0028)%1;p.position.y=p.userData.base.y+p.userData.life*7;p.position.x=p.userData.base.x+Math.sin(t*.5+i)*p.userData.life*.8;p.scale.setScalar(.5+p.userData.life*1.5);p.material.opacity=(1-p.userData.life)*.18});
 tanks.forEach((tank,i)=>{const a=t*.12+i*2.1;tank.position.x=Math.sin(a)*15;tank.position.z=Math.cos(a)*7;tank.rotation.y=Math.atan2(Math.cos(a)*15,-Math.sin(a)*7)});
 heli.position.x=10+Math.sin(t*.24)*10;heli.position.z=-12+Math.cos(t*.24)*6;heli.position.y=13+Math.sin(t*.8)*.6;heli.userData.rotor.rotation.y=t*20;heli.rotation.y=-t*.24;
 glowMat.emissiveIntensity=1.8+Math.sin(t*2.2)*.5;
 radarUnit.userData.dish.rotation.z=t*.45;
 towers.forEach((tw,i)=>tw.userData.beacon.material.emissiveIntensity=2.2+Math.sin(t*4+i)*1.4);

 controls.update();renderer.render(scene,camera);
}
animate();
