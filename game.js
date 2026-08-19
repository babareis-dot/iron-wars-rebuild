console.log("IRON WARS REBUILD v7 WORLD BASE loaded");
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const canvas=document.getElementById('scene');
const renderer=new THREE.WebGLRenderer({canvas,antialias:false,powerPreference:'high-performance'});
renderer.setPixelRatio(Math.min(devicePixelRatio,1.15));
renderer.shadowMap.enabled=true;
renderer.shadowMap.type=THREE.PCFShadowMap;
renderer.outputColorSpace=THREE.SRGBColorSpace;

const scene=new THREE.Scene();
scene.background=new THREE.Color(0x0d1a24);
scene.fog=new THREE.FogExp2(0x17231b,0.0045);

const camera=new THREE.PerspectiveCamera(48,1,0.1,500);
camera.position.set(34,30,40);

const controls=new OrbitControls(camera,renderer.domElement);
controls.target.set(0,0,0);
controls.enableDamping=true;
controls.dampingFactor=.06;
controls.minDistance=24;
controls.maxDistance=105;
controls.maxPolarAngle=Math.PI*.48;
controls.minPolarAngle=Math.PI*.20;
controls.enablePan=true;
controls.screenSpacePanning=false;

const hemi=new THREE.HemisphereLight(0x759fb6,0x0f1713,0.95);scene.add(hemi);
const sun=new THREE.DirectionalLight(0xffc98c,2.7);sun.position.set(-20,35,12);sun.castShadow=true;
sun.shadow.mapSize.set(1024,1024);sun.shadow.camera.left=-45;sun.shadow.camera.right=45;sun.shadow.camera.top=45;sun.shadow.camera.bottom=-45;scene.add(sun);

// v5: DW-style large scrollable world, but original Iron Wars visuals
const seaMat=new THREE.MeshStandardMaterial({color:0x5b603d,roughness:1,metalness:0});
const seaGeo=new THREE.PlaneGeometry(240,240,1,1);
const sea=new THREE.Mesh(seaGeo,seaMat);sea.rotation.x=-Math.PI/2;sea.position.y=1.45;sea.receiveShadow=true;scene.add(sea);

const island=new THREE.Mesh(new THREE.CylinderGeometry(29,31,0.7,32),new THREE.MeshStandardMaterial({color:0x49543b,roughness:1}));
island.position.y=1.15;island.receiveShadow=true;scene.add(island);

// terrain patches make the world feel less empty without expensive geometry
const patchMat=new THREE.MeshStandardMaterial({color:0x656344,roughness:1});
for(let i=0;i<22;i++){
 const p=new THREE.Mesh(new THREE.CircleGeometry(5+Math.random()*9,12),patchMat);
 p.rotation.x=-Math.PI/2;p.position.set((Math.random()-.5)*180,1.48,(Math.random()-.5)*180);
 p.scale.y=.55+Math.random()*.7;scene.add(p);
}

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
 const bulb=new THREE.Mesh(new THREE.SphereGeometry(.11,6,6),amberGlow);bulb.position.set(x,4,z);scene.add(bulb);
}
for(let x=-16;x<=16;x+=8){lamp(x,2.8);lamp(x,-2.8)}

function wallSegment(x,z,w,d){
 const m=new THREE.Mesh(new THREE.BoxGeometry(w,1.2,d),concrete);m.position.set(x,2.1,z);m.castShadow=true;scene.add(m);
}
// v5 başlangıç üssü duvarsız
// Two base flags
function baseFlag(x,z,flip=1){
 const g=new THREE.Group();g.position.set(x,1.55,z);
 const pole=new THREE.Mesh(new THREE.CylinderGeometry(.045,.06,4.4,6),metal);pole.position.y=2.2;g.add(pole);
 const flag=new THREE.Mesh(new THREE.PlaneGeometry(1.45,.8),new THREE.MeshStandardMaterial({color:0x9b1d1d,side:THREE.DoubleSide,roughness:.75}));
 flag.position.set(.72*flip,3.75,0);flag.rotation.y=flip<0?Math.PI:0;g.add(flag);g.userData.flag=flag;scene.add(g);return g;
}
const baseFlags=[baseFlag(-4,-5,1),baseFlag(4,-5,-1)];

// Four starter missile launchers, no wall required
function starterMissile(x,z,rot=0){
 const g=new THREE.Group();g.position.set(x,1.62,z);g.rotation.y=rot;
 const pad=new THREE.Mesh(new THREE.CylinderGeometry(1.05,1.2,.28,12),darkMat);pad.position.y=.14;g.add(pad);
 const tubeMat=new THREE.MeshStandardMaterial({color:0x4b5748,roughness:.65,metalness:.25});
 for(let i=-1;i<=1;i+=2){
   const tube=new THREE.Mesh(new THREE.CylinderGeometry(.22,.27,2.8,8),tubeMat);
   tube.rotation.z=-.28;tube.position.set(i*.32,1.55,0);g.add(tube);
   const tip=new THREE.Mesh(new THREE.ConeGeometry(.22,.55,8),new THREE.MeshStandardMaterial({color:0x6f756b,roughness:.6}));
   tip.rotation.z=-.28;tip.position.set(i*.32+.39,2.87,0);g.add(tip);
 }
 scene.add(g);return g;
}
const starterMissiles=[
 starterMissile(-8,-10,.2),starterMissile(8,-10,-.2),
 starterMissile(-9,12,2.8),starterMissile(9,12,-2.8)
];

// V6: lightweight world sectors / distant base plots
const sectorMat=new THREE.MeshStandardMaterial({color:0x4d5035,roughness:1});
const sectorRingMat=new THREE.MeshBasicMaterial({color:0x8c8150,transparent:true,opacity:.28,side:THREE.DoubleSide});
[[-55,-42],[58,-35],[-61,49],[62,52]].forEach((q,idx)=>{
 const plot=new THREE.Mesh(new THREE.CircleGeometry(8,16),sectorMat);
 plot.rotation.x=-Math.PI/2;plot.position.set(q[0],1.51,q[1]);scene.add(plot);
 const ring=new THREE.Mesh(new THREE.RingGeometry(8.5,9,24),sectorRingMat);
 ring.rotation.x=-Math.PI/2;ring.position.set(q[0],1.53,q[1]);scene.add(ring);
 // tiny outpost silhouette
 const out=new THREE.Mesh(new THREE.BoxGeometry(3.2,1.6,2.5),darkMat);
 out.position.set(q[0],2.3,q[1]);scene.add(out);
});

// V6: make starter missile sites visually easier to read without adding costly lights
starterMissiles.forEach((m,i)=>{
 const ring=new THREE.Mesh(new THREE.RingGeometry(1.25,1.55,18),
   new THREE.MeshBasicMaterial({color:0x9c7e35,transparent:true,opacity:.45,side:THREE.DoubleSide}));
 ring.rotation.x=-Math.PI/2;ring.position.y=.03;m.add(ring);
});



// V7 — denser DW-style base environment (original Iron Wars assets)
const grassMat2=new THREE.MeshStandardMaterial({color:0x667044,roughness:1});
const rockMat=new THREE.MeshStandardMaterial({color:0x77766b,roughness:1});
const trunkMat=new THREE.MeshStandardMaterial({color:0x4b3928,roughness:1});
const leafMat=new THREE.MeshStandardMaterial({color:0x24452b,roughness:1});
function tree(x,z,s=1){
 const g=new THREE.Group(); g.position.set(x,1.52,z); g.scale.setScalar(s);
 const t=new THREE.Mesh(new THREE.CylinderGeometry(.12,.18,1.3,6),trunkMat);t.position.y=.65;g.add(t);
 const a=new THREE.Mesh(new THREE.ConeGeometry(.72,1.9,7),leafMat);a.position.y=1.75;g.add(a);
 const b=new THREE.Mesh(new THREE.ConeGeometry(.58,1.55,7),leafMat);b.position.y=2.45;g.add(b);
 scene.add(g);
}
function rock(x,z,s=1){
 const r=new THREE.Mesh(new THREE.DodecahedronGeometry(.55*s,0),rockMat);r.scale.y=.65;r.rotation.set(Math.random(),Math.random(),Math.random());r.position.set(x,1.82,z);scene.add(r);
}
// Keep the center readable; vegetation hugs the outer base like the reference layout.
for(let i=0;i<78;i++){
 const a=Math.random()*Math.PI*2, rad=20+Math.random()*8;
 tree(Math.cos(a)*rad,Math.sin(a)*rad,.65+Math.random()*.7);
}
for(let i=0;i<34;i++){
 const a=Math.random()*Math.PI*2, rad=18+Math.random()*11;
 rock(Math.cos(a)*rad,Math.sin(a)*rad,.5+Math.random()*1.2);
}
// Small industrial storage groups around the base.
function tankCluster(x,z){
 const g=new THREE.Group();g.position.set(x,1.55,z);
 for(let ix=-1;ix<=1;ix++) for(let iz=-1;iz<=1;iz++){
   const c=new THREE.Mesh(new THREE.CylinderGeometry(.38,.42,.8,10),metal);c.position.set(ix*.9,.4,iz*.9);g.add(c);
 }
 scene.add(g);
}
tankCluster(-20,-3);tankCluster(19,8);
// Ground pads visually separate structures without walls.
const padMat=new THREE.MeshStandardMaterial({color:0x555a4b,roughness:1});
buildings.forEach(b=>{
 const pad=new THREE.Mesh(new THREE.CylinderGeometry(4.6,5,.16,16),padMat);pad.position.set(b.position.x,1.58,b.position.z);pad.receiveShadow=true;scene.add(pad);
});


const crates=[];
for(let i=0;i<10;i++){
 const c=new THREE.Mesh(new THREE.BoxGeometry(.7,.7,.7),new THREE.MeshStandardMaterial({color:0x705234,roughness:.9}));
 c.position.set(-5+Math.random()*10,2.05,14+Math.random()*3);c.rotation.y=Math.random()*Math.PI;c.castShadow=false;scene.add(c);crates.push(c);
}


function chimney(parent,ox,oz,h=5){
 const c=new THREE.Mesh(new THREE.CylinderGeometry(.35,.48,h,10),darkMat);c.position.set(ox,h/2+.4,oz);c.castShadow=true;parent.add(c);
}
chimney(buildings.find(b=>b.userData.id==='steel'),-2,0,6);
chimney(buildings.find(b=>b.userData.id==='fuel'),1.4,0,5);

const smokeParticles=[];
function addSmokeEmitter(building){
 const origin=new THREE.Vector3();building.getWorldPosition(origin);origin.y+=7;
 for(let i=0;i<8;i++){
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
for(let i=0;i<32;i++){
 const a=Math.random()*Math.PI*2,r=20+Math.random()*6;
 const trunk=new THREE.Mesh(new THREE.CylinderGeometry(.12,.18,1.1,6),new THREE.MeshStandardMaterial({color:0x5c442c}));
 const crown=new THREE.Mesh(new THREE.ConeGeometry(.7,2.2,7),new THREE.MeshStandardMaterial({color:0x2e5434}));
 const g=new THREE.Group();trunk.position.y=.55;crown.position.y=1.7;trunk.castShadow=false;crown.castShadow=false;g.add(trunk,crown);g.position.set(Math.cos(a)*r,1.55,Math.sin(a)*r);scene.add(g);trees.push(g);
}


// ===================== v3 VISUAL SYSTEM =====================

// procedural asphalt texture
function canvasTexture(drawFn, size=512){
 const c=document.createElement("canvas"); c.width=c.height=size;
 const ctx=c.getContext("2d"); drawFn(ctx,size);
 const tex=new THREE.CanvasTexture(c); tex.wrapS=tex.wrapT=THREE.RepeatWrapping;
 tex.colorSpace=THREE.SRGBColorSpace; return tex;
}
const asphaltTex=canvasTexture((ctx,s)=>{
 ctx.fillStyle="#242b2f";ctx.fillRect(0,0,s,s);
 for(let i=0;i<4500;i++){
  const v=30+Math.random()*35;ctx.fillStyle=`rgb(${v},${v+3},${v+5})`;
  const x=Math.random()*s,y=Math.random()*s,r=Math.random()*1.6+.2;ctx.fillRect(x,y,r,r);
 }
 ctx.strokeStyle="rgba(210,200,150,.55)";ctx.lineWidth=3;ctx.setLineDash([18,18]);
 ctx.beginPath();ctx.moveTo(0,s/2);ctx.lineTo(s,s/2);ctx.stroke();
},512);
asphaltTex.repeat.set(5,1);

const roadRealMat=new THREE.MeshStandardMaterial({map:asphaltTex,roughness:.92,metalness:.03});
function roadReal(x,z,w,d,rot=0){
 const m=new THREE.Mesh(new THREE.BoxGeometry(w,.12,d),roadRealMat);
 m.position.set(x,1.72,z);m.rotation.y=rot;m.receiveShadow=true;scene.add(m);return m;
}
roadReal(0,0,44,4.8,0);
roadReal(0,0,4.8,37,0);
roadReal(-8,-8,18,3.6,.24);
roadReal(10,9,20,3.8,-.18);
roadReal(11,-8,16,3.5,.12);

// concrete lots
const lotMat=new THREE.MeshStandardMaterial({color:0x414a4d,roughness:.94});
function lot(x,z,w,d,rot=0){
 const m=new THREE.Mesh(new THREE.BoxGeometry(w,.1,d),lotMat);m.position.set(x,1.69,z);m.rotation.y=rot;m.receiveShadow=true;scene.add(m);
}
lot(13,1,17,11,-.08);lot(16,11,16,10,0);lot(-12,7,11,9,0);lot(0,-1,11,10,0);

// runway lights
const runwayBulbs=[];
for(let i=-8;i<=8;i+=2){
 const m1=new THREE.Mesh(new THREE.SphereGeometry(.08,6,6),new THREE.MeshBasicMaterial({color:i%4?0x9edcff:0xffe5b3}));
 m1.position.set(13+i,1.9,-i*.08+2.2);scene.add(m1);runwayBulbs.push(m1);
 const m2=m1.clone();m2.position.z-=4.4;scene.add(m2);runwayBulbs.push(m2);
}

// defensive barriers
const barrierMat=new THREE.MeshStandardMaterial({color:0x72766b,roughness:1});
for(let i=-18;i<=18;i+=3){
 const b1=new THREE.Mesh(new THREE.BoxGeometry(1.5,.7,.8),barrierMat);b1.position.set(i,2.05,-18);b1.rotation.y=.08;scene.add(b1);
}

// watchtowers
function watchTower(x,z){
 const g=new THREE.Group();g.position.set(x,1.7,z);
 const legMat=new THREE.MeshStandardMaterial({color:0x38464c,metalness:.6,roughness:.5});
 for(const sx of [-.7,.7]) for(const sz of [-.7,.7]){
  const leg=new THREE.Mesh(new THREE.CylinderGeometry(.08,.12,5,6),legMat);leg.position.set(sx,2.5,sz);leg.castShadow=true;g.add(leg)
 }
 const deck=new THREE.Mesh(new THREE.BoxGeometry(2.2,.3,2.2),legMat);deck.position.y=5;g.add(deck);
 const hut=new THREE.Mesh(new THREE.BoxGeometry(1.5,1.3,1.5),new THREE.MeshStandardMaterial({color:0x53646a,roughness:.7}));hut.position.y=5.7;hut.castShadow=true;g.add(hut);
 const beacon=new THREE.PointLight(0xff3b25,.9,8,2);beacon.position.y=6.7;g.add(beacon);
 scene.add(g);return {g,beacon};
}
const watchTowers=[watchTower(-20,-16),watchTower(20,-16),watchTower(-20,16),watchTower(20,16)];

// fuel tanks
function fuelTank(x,z){
 const g=new THREE.Group();g.position.set(x,1.7,z);
 const tank=new THREE.Mesh(new THREE.CylinderGeometry(1.4,1.4,2.5,24),new THREE.MeshStandardMaterial({color:0x6a7270,metalness:.4,roughness:.55}));
 tank.position.y=1.25;tank.castShadow=true;g.add(tank);
 const ring=new THREE.Mesh(new THREE.TorusGeometry(1.42,.05,8,24),metal);ring.rotation.x=Math.PI/2;ring.position.y=2.1;g.add(ring);
 scene.add(g);return g;
}
fuelTank(-15,-8);fuelTank(-12,-8);fuelTank(-15,-11);

// more industrial stacks
function stack(x,z,h=7){
 const g=new THREE.Group();g.position.set(x,1.7,z);
 const mat=new THREE.MeshStandardMaterial({color:0x4e575c,metalness:.45,roughness:.6});
 const body=new THREE.Mesh(new THREE.CylinderGeometry(.35,.55,h,12),mat);body.position.y=h/2;body.castShadow=true;g.add(body);
 const red=new THREE.Mesh(new THREE.CylinderGeometry(.37,.37,.7,12),new THREE.MeshStandardMaterial({color:0xa43b2e,roughness:.7}));red.position.y=h-.8;g.add(red);
 scene.add(g);return g;
}
const extraStacks=[stack(-14,6,7.5),stack(-11,6,6.5),stack(-13,-6,6.2)];

// realistic-ish ship
function makeShip(scale=1){
 const g=new THREE.Group();
 const hull=new THREE.Mesh(new THREE.BoxGeometry(6*scale,.8*scale,1.8*scale),new THREE.MeshStandardMaterial({color:0x26343a,metalness:.5,roughness:.55}));
 hull.position.y=.4*scale;g.add(hull);
 const bow=new THREE.Mesh(new THREE.ConeGeometry(.9*scale,2*scale,4),new THREE.MeshStandardMaterial({color:0x26343a,metalness:.5,roughness:.55}));
 bow.rotation.z=-Math.PI/2;bow.position.x=3.8*scale;bow.position.y=.4*scale;g.add(bow);
 const superstructure=new THREE.Mesh(new THREE.BoxGeometry(2*scale,1.1*scale,1.1*scale),new THREE.MeshStandardMaterial({color:0x59676c,roughness:.65}));
 superstructure.position.set(-.6*scale,1.25*scale,0);g.add(superstructure);
 const mast=new THREE.Mesh(new THREE.CylinderGeometry(.05*scale,.07*scale,2.2*scale,6),metal);mast.position.set(-.5*scale,2.5*scale,0);g.add(mast);
 scene.add(g);return g;
}
const ships=[makeShip(1),makeShip(.7)];
ships[0].position.set(25,.1,13);ships[0].rotation.y=Math.PI;
ships[1].position.set(23,.1,8);ships[1].rotation.y=Math.PI*.93;

// detailed tanks
function makeTankV3(){
 const g=new THREE.Group();
 const olive=new THREE.MeshStandardMaterial({color:0x48523f,roughness:.72,metalness:.15});
 const tracks=new THREE.MeshStandardMaterial({color:0x20282b,roughness:.8,metalness:.45});
 const body=new THREE.Mesh(new THREE.BoxGeometry(2.1,.65,3),olive);body.position.y=.65;body.castShadow=true;g.add(body);
 const leftTrack=new THREE.Mesh(new THREE.BoxGeometry(.38,.55,3.25),tracks);leftTrack.position.set(-1.05,.48,0);g.add(leftTrack);
 const rightTrack=leftTrack.clone();rightTrack.position.x=1.05;g.add(rightTrack);
 const turret=new THREE.Mesh(new THREE.CylinderGeometry(.72,.82,.48,12),olive);turret.position.y=1.2;g.add(turret);
 const barrel=new THREE.Mesh(new THREE.CylinderGeometry(.07,.09,2.5,8),tracks);barrel.rotation.x=Math.PI/2;barrel.position.set(0,1.25,-1.55);g.add(barrel);
 scene.add(g);return g;
}
tanks.forEach(t=>scene.remove(t));
tanks.length=0;
for(let i=0;i<3;i++){const t=makeTankV3();t.position.set(-18+i*3,1.8,0);tanks.push(t)}

// more detailed helicopter
scene.remove(heli);
function helicopterV3(){
 const g=new THREE.Group();
 const mat=new THREE.MeshStandardMaterial({color:0x28352f,roughness:.58,metalness:.3});
 const body=new THREE.Mesh(new THREE.SphereGeometry(1.2,16,12),mat);body.scale.set(1.5,.65,.65);g.add(body);
 const cockpit=new THREE.Mesh(new THREE.SphereGeometry(.75,12,8),new THREE.MeshStandardMaterial({color:0x16272e,metalness:.5,roughness:.25}));cockpit.scale.set(1,.55,.55);cockpit.position.x=1.3;g.add(cockpit);
 const tail=new THREE.Mesh(new THREE.BoxGeometry(3,.18,.18),mat);tail.position.x=-2.5;g.add(tail);
 const rotor=new THREE.Mesh(new THREE.BoxGeometry(5.8,.035,.12),darkMat);rotor.position.y=.9;g.add(rotor);
 const rotor2=new THREE.Mesh(new THREE.BoxGeometry(.08,1.5,.08),darkMat);rotor2.position.x=-4;g.add(rotor2);
 const light=new THREE.SpotLight(0xe8f4ff,1.5,25,.35,.6,1.5);light.position.set(1,-.2,0);light.target.position.set(6,-8,0);g.add(light,light.target);
 g.userData.rotor=rotor;g.userData.rotor2=rotor2;scene.add(g);return g;
}
const heliV3=helicopterV3();heliV3.position.set(10,13,-12);

// fence line
const fenceMat=new THREE.MeshStandardMaterial({color:0x4d5a5f,metalness:.6,roughness:.5});
function fence(x,z,w,d){
 const g=new THREE.Group();
 if(w>0){
  const rail=new THREE.Mesh(new THREE.BoxGeometry(w,.05,.05),fenceMat);rail.position.set(x,2.3,z);scene.add(rail);
  for(let i=-w/2;i<=w/2;i+=2){const p=new THREE.Mesh(new THREE.CylinderGeometry(.03,.04,1.4,5),fenceMat);p.position.set(x+i,2,z);scene.add(p)}
 }else{
  const rail=new THREE.Mesh(new THREE.BoxGeometry(.05,.05,d),fenceMat);rail.position.set(x,2.3,z);scene.add(rail);
  for(let i=-d/2;i<=d/2;i+=2){const p=new THREE.Mesh(new THREE.CylinderGeometry(.03,.04,1.4,5),fenceMat);p.position.set(x,2,z+i);scene.add(p)}
 }
}
fence(0,-20,40,0);fence(-20,0,0,40);fence(20,0,0,40);

const raycaster=new THREE.Raycaster(),pointer=new THREE.Vector2();
let selected=null;
const MAX_LEVEL=25;
const defaultState={resources:{money:0,fuel:50000,steel:100000,copper:100000,gold:25000,titanium:0},levels:{steel:1,fuel:1,copper:1,gold:1,hq:1,tank:1,air:1,dock:1},production:{},upgrades:{}};
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

const isMobile=matchMedia("(max-width: 900px)").matches || /Android|iPhone|iPad/i.test(navigator.userAgent);
if(isMobile){
 renderer.setPixelRatio(Math.min(devicePixelRatio,1.0));
 sun.shadow.mapSize.set(768,768);
 scene.fog.density=.0105;
}

addEventListener('resize',resize);resize();renderResources();setInterval(tickEconomy,250);

const clock=new THREE.Clock();let frameCount=0;
let pageVisible=true;
document.addEventListener("visibilitychange",()=>pageVisible=!document.hidden);
function animate(){
 requestAnimationFrame(animate);
 if(!pageVisible)return;
 const t=clock.getElapsedTime();
 frameCount++;
 // v5 terrain is static for mobile performance
 baseFlags.forEach((f,i)=>{f.userData.flag.rotation.y=(i?Math.PI:0)+Math.sin(t*1.35+i)*.055});
 controls.target.x=THREE.MathUtils.clamp(controls.target.x,-82,82);
 controls.target.z=THREE.MathUtils.clamp(controls.target.z,-82,82);
 smokeParticles.forEach((p,i)=>{p.userData.life=(p.userData.life+.0028)%1;p.position.y=p.userData.base.y+p.userData.life*7;p.position.x=p.userData.base.x+Math.sin(t*.5+i)*p.userData.life*.8;p.scale.setScalar(.5+p.userData.life*1.5);p.material.opacity=(1-p.userData.life)*.18});
 tanks.forEach((tank,i)=>{const a=t*.12+i*2.1;tank.position.x=Math.sin(a)*15;tank.position.z=Math.cos(a)*7;tank.rotation.y=Math.atan2(Math.cos(a)*15,-Math.sin(a)*7)});
 heliV3.position.x=10+Math.sin(t*.24)*10;heliV3.position.z=-12+Math.cos(t*.24)*6;heliV3.position.y=13+Math.sin(t*.8)*.6;heliV3.userData.rotor.rotation.y=t*20;heliV3.userData.rotor2.rotation.x=t*18;heliV3.rotation.y=-t*.24;
 glowMat.emissiveIntensity=1.8+Math.sin(t*2.2)*.5;
 runwayBulbs.forEach((b,i)=>{const s=.75+Math.max(0,Math.sin(t*2.8-i*.45))*.45;b.scale.setScalar(s)});
 watchTowers.forEach((w,i)=>w.beacon.intensity=.45+Math.max(0,Math.sin(t*3+i))*.95);
 ships[0].position.x=24+Math.sin(t*.08)*2.2;
 ships[1].position.x=22+Math.sin(t*.11+1)*1.5;

 radarUnit.userData.dish.rotation.z=t*.45;
 towers.forEach((tw,i)=>tw.userData.beacon.material.emissiveIntensity=2.2+Math.sin(t*4+i)*1.4);

 controls.update();renderer.render(scene,camera);
}

// V8 COMPLETE: DW5-inspired strategy systems (original Iron Wars assets/gameplay)
state.units ||= {tank:0,artillery:0,jet:0,ship:0};
state.queue ||= [];
state.inventory ||= {missile:4,stella:0};
state.profile ||= {xp:0,commanderLevel:1};
function systemOpen(title,body){systemTitle.textContent=title;systemBody.innerHTML=body;systemPanel.classList.remove('hidden')}
closeSystem.onclick=()=>systemPanel.classList.add('hidden');
function queueUnit(type,costSteel,costFuel,seconds){
 if(state.resources.steel<costSteel||state.resources.fuel<costFuel){toast('Yetersiz Çelik veya Fuel');return}
 state.resources.steel-=costSteel;state.resources.fuel-=costFuel;state.queue.push({type,end:Date.now()+seconds*1000});save();renderResources();toast(type+' üretime alındı');showProduction();
}
window.queueUnit=queueUnit;
function showProduction(){
 const q=state.queue.map(x=>`<div class="sys-row">${x.type}<b>${Math.max(0,Math.ceil((x.end-Date.now())/1000))} sn</b></div>`).join('')||'<p>Üretim kuyruğu boş.</p>';
 systemOpen('ASKERİ ÜRETİM',`<div class="sys-grid"><button onclick="queueUnit('Tank',12000,5000,30)">🛡️ TANK<small>12K Çelik • 5K Fuel • 30sn</small></button><button onclick="queueUnit('Topçu',18000,7000,45)">💥 TOPÇU<small>18K Çelik • 7K Fuel • 45sn</small></button><button onclick="queueUnit('Jet',30000,18000,60)">✈️ JET<small>30K Çelik • 18K Fuel • 60sn</small></button><button onclick="queueUnit('Gemi',45000,22000,90)">🚢 GEMİ<small>45K Çelik • 22K Fuel • 90sn</small></button></div><h3>KUYRUK</h3>${q}`)
}
function showArmy(){systemOpen('BİRLİKLER',`<div class="army-stats"><div>🛡️ Tank<b>${state.units.tank||0}</b></div><div>💥 Topçu<b>${state.units.artillery||0}</b></div><div>✈️ Jet<b>${state.units.jet||0}</b></div><div>🚢 Gemi<b>${state.units.ship||0}</b></div><div>🚀 Füze<b>${state.inventory.missile||0}</b></div><div>☢️ Stella<b>${state.inventory.stella||0}</b></div></div>`)}
function showShop(){systemOpen('MAĞAZA',`<p>Premium kaynak: Titanyum. Gerçek ödeme entegrasyonu yok; GitHub Pages sürümünde demo mağazadır.</p><div class="sys-grid"><button id="demoTitan">💎 100 TİTANYUM<small>Demo paket</small></button><button id="buyStella">☢️ STELLA<small>50 Titanyum</small></button></div><p>Titanyum: <b>${state.resources.titanium||0}</b></p>`);demoTitan.onclick=()=>{state.resources.titanium=(state.resources.titanium||0)+100;save();showShop()};buyStella.onclick=()=>{if((state.resources.titanium||0)<50)return toast('Yetersiz Titanyum');state.resources.titanium-=50;state.inventory.stella++;save();showShop()}}
function showWorld(){systemOpen('IRON WORLD',`<div class="worldmap"><span class="base me" style="left:48%;top:45%">◆<small>SEN X500 Y500</small></span><span class="base enemy" style="left:22%;top:28%">◆<small>NPC ALPHA</small></span><span class="base enemy" style="left:72%;top:24%">◆<small>NPC BRAVO</small></span><span class="base ally" style="left:66%;top:68%">◆<small>MÜTTEFİK</small></span></div><p>Dünya haritası prototipi. Gerçek oyuncular için sonraki aşamada sunucu/veritabanı gerekir.</p>`)}
unitsBtn.onclick=showProduction;armyBtn.onclick=showArmy;shopBtn.onclick=showShop;worldBtn.onclick=showWorld;
function tickQueue(){let changed=false;for(let i=state.queue.length-1;i>=0;i--){if(Date.now()>=state.queue[i].end){const t=state.queue[i].type;if(t==='Tank')state.units.tank++;else if(t==='Topçu')state.units.artillery++;else if(t==='Jet')state.units.jet++;else if(t==='Gemi')state.units.ship++;state.queue.splice(i,1);state.profile.xp+=25;changed=true;toast(t+' hazır!')}}if(changed)save()}
setInterval(tickQueue,500);

animate();
