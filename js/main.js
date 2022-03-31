let width;
let height;
var canvas;
var ctx;
const FPS=30;
var particles=[];
var cRange=100;
let colors = ["note","PinkNote","GNote","PurpleNote"];
let rotate=13;

function rotateNote(note){
  var degrees=rotate-Math.random()*rotate*2;
  note.style.transform= 'rotate('+ degrees +'deg)';
}

function pinned(note){
  let dot =note.getElementsByClassName("dot")[0];
  dot.style.backgroundColor='rgb('+Math.random()*255+','+Math.random()*255+','+Math.random()*255+')';
  dot.style.marginLeft = note.offsetWidth*0.5+(3-Math.random()*6)+'px';
  dot.style.marginTop = '-2em';
}

function randomizeNote(note){
  let c=colors[Math.trunc(Math.random()*4)];
  let classes=note.className.split(" ");
  let newClass="";
  for(let cl of classes){
      if(cl !="note")
      {
          newClass+=cl+" ";
      }
  }
  newClass+=c;
  note.className=newClass;
  return c;
}
function setup()
{
  let notes = document.getElementsByClassName("note");
  if(notes.length>0)
  {
    for(let note of notes)
    {
      rotateNote(note);
      pinned(note);
      randomizeNote(note);
    }  
  }
  width=document.body.clientWidth;
  height=document.body.clientHeight;
  canvas=document.getElementById("particle-js");
  canvas.width=width;
  canvas.height=height/2;
  ctx=canvas.getContext("2d");
  ctx.globalAlpha=0.2;
  for (let i = 0; i < 50; i++) {
    particles[i] = new Particle(Math.random()*width, Math.random()*height);
  }
}

function draw()
{
  ctx.fillStyle="#ffffff";
  ctx.fillRect(0,0,width,height);
  let boundary = new Rectangle(0, 0, width, height);
  let qtree = new QuadTree(boundary, 4);

  for (let p of particles) {
    let point = new Point(p.location.x, p.location.y, p);
    qtree.insert(point);
    p.render(ctx);
    p.update();
    p.setHighlight(false);
  }

  for (let p of particles) {
    let range = new Circle(p.location.x, p.location.y, cRange);
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

window.onresize=function(){
  setup();  
}
window.onload = function() {
  setup();
  setInterval("draw()", 1000/FPS);
};
