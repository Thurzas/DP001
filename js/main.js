var width;
var height;
var canvas;
var c2;
var ctx;
var ctx2;
const FPS=30;
var particles=[];
var bparticles=[];
var pRange=30;
var BRange=200;
var blackhole;
let G=0.0667;
let param="blackHole";
let background="#fff";
let count=500;
let maxP=60;
var color ="#fff"
var colorh="#60a3ff";
var spin = 6;
countP=100;
function setup()
{
  width=document.body.clientWidth;
  height=document.body.clientHeight;
  canvas=document.getElementById("particle-js");
  c2=document.getElementById("blackHole");
  if(c2!=="null"&& c2!=="undefined")
  {
    c2.width=width;
    c2.height=height*.4;
  }
  canvas.width=width;
  canvas.height=height*.15;
  ctx=canvas.getContext("2d");
  ctx2=c2.getContext("2d");
  if(canvas.width<1000)
  countP=50;

  for (let i = 0; i < countP; i++) {
    let vec= new V(Math.random()*canvas.width,Math.random()*canvas.height);
    particles[i] = new Particle(vec.x, vec.y);
  }
  for (let i = 0; i < count; i++) {
    let vec= getRandomPointInCircle(c2.width*0.5,c2.height*0.5,BRange);
    bparticles[i] = new Particle(vec.x, vec.y);
  }
  blackhole=new blackHole(width*0.5,c2.height*0.5);
  ctx.globalAlpha=0.1;
  ctx2.globalAlpha=0.1;
}

  function getRandomPointInCircle(x,y,radius)
  {
    let t = 2 * Math.PI * Math.random();
    let u = Math.random() + Math.random();
    let r;
    if (u > 1)
        r = 2 - u;
    else
        r = u;

    return new V(x+radius * r * Math.cos(t),y+ radius* r*Math.sin(t));
  }

  function eat(p)
  {
    this.mass+=p.mass;
    p.location=getRandomPointInCircle(p.location.x,p.location.y,BRange);
    p.v=new V(0,0);
    p.a=new V(0,0);
    p.mass=Math.random()*maxP+1;
    p.r=p.mass*0.1;
  }

  function bhole(ctx)
  {
    color="#fff";
    colorh="#fdb300";
    ctx.fillStyle="#000";
    pRange=30;
    ctx.fillRect(0,0,c2.width,c2.height);
    let boundary = new Rectangle(0, 0, width, height);
    let qtree = new QuadTree(boundary, 4);
    blackhole.render(ctx);

    for (let p of bparticles) {
      let point = new Point(p.location.x, p.location.y, p);
      qtree.insert(point);
      p.render(ctx);
      p.update(ctx);
      p.setHighlight(false);
      let f = blackhole.attract(p);
      if(blackhole.intersects(p))
         eat(p);
      p.ApplyForce(f);
    }
    for(let p of bparticles)
    {
      let range = new Circle(p.location.x, p.location.y, pRange);
      let points = qtree.query(range);
      for (let point of points) {
        let other = point.userData;
        if (p !== other && p.intersects(other)) {
              p.setHighlight(true);
        }
      }
    }
  }

  function net(ctx){    
    color="#60a3ff";
    colorh="#f00";
    ctx.fillStyle="#ffffff";
    ctx.lineWeight=5;
    pRange=100;
    ctx.fillRect(0,0,canvas.width,canvas.height);

    let boundary = new Rectangle(0, 0, canvas.width, canvas.height);
    let qtree = new QuadTree(boundary, 4);
    for (let p of particles) {
      let point = new Point(p.location.x, p.location.y, p);
      qtree.insert(point);
      p.render(ctx);
      p.update(ctx);
      p.wander();
      p.setHighlight(false);
    }

    for (let p of particles) {
      let range = new Circle(p.location.x, p.location.y, pRange);
      let points = qtree.query(range);
      for (let point of points) {
        let other = point.userData;        
        p.line(other);
        // for (let other of particles) {
        if (p !== other && p.intersects(other)) {
          p.setHighlight(true);
        }
      }
    }
  }
  function draw()
  {
    net(ctx);
    bhole(ctx2);
    
    window.requestAnimationFrame(draw);  
  }

window.onresize=function()
{
  setup();
}
window.onload = function()
{
  setup();
  window.requestAnimationFrame(draw);  
}
/*window.onload = function() {
  setup();
  setInterval("draw()", 1000/FPS);
};
*/