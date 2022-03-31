class Particle {
  constructor(x, y) {
    this.location=new V(x,y);
    this.v=new V(0,0);
    this.r = 4;
    this.a=new V(0,0);
    this.highlight = false;
    this.maxSpeed=4;
    this.maxForce=0.1;
    this.connects=[];
  }
  dist(x,y,xx,yy) {
    let dx = x - xx;
    let dy = y - yy;
    return Math.sqrt(dx*dx + dy*dy);
  }
  intersects(other) {
    let d = this.dist(this.location.x, this.location.y, other.location.x, other.location.y);
    return d < this.r + other.r;
  }

  setHighlight(value) {
    this.highlight = value;
  }

  Connect(){
    this.r=Math.random();
  }
  move() {
    var r=6
    this.location.x +=r- Math.random()*2*r;
    this.location.y +=r- Math.random()*2*r;
  }
  line(other){
    this.connects.push(other);
  }
  update() {
    this.v=this.v.add(this.a);
    this.v=this.v.limit(this.maxSpeed);
    this.location=this.location.add(this.v);
    this.a.x=0;
    this.a.y=0;
    this.wander();
    if(this.location.x>width)
    {
      this.location.x=0;
      this.connects=[];
    }
    if(this.location.y>height)
    {
     this.location.y=0;
     this.connects=[];
    }
    if(this.location.x<0)
    {
      this.location.x=width;
      this.connects=[];
    }
    if(this.location.y<0)
    {
      this.location.y=height;
      this.connects=[];
    }
  }
  ApplyForce(p)
  {
    this.a=this.a.add(p);
  }

  seek(target) {
    let desired = target.sub(this.location);
    desired=desired.normalize();
    desired=desired.mult(this.maxSpeed);
    let steer = desired.sub(this.v);
    steer=steer.limit(this.maxForce);
    this.ApplyForce(steer);
  }
  polar(a , rad ){
    let dx=rad*Math.cos(a),dy=rad*Math.sin(a);
    return new V(dx,dy);
  }
  wander(){
    let rad=10;
    let p =this.polar((this.v.heading()+Math.random()*360)*Math.PI/180,rad/2);
    let target=this.v.copy();
    let range=10;
    if(!this.v.isNull())
    target.setMag(range);
    target=target.add(this.location);
    target=target.add(p);
    //p.limit(wand);
    this.seek(target);

  }

  render(ctx) {

    ctx.beginPath();
    ctx.arc(this.location.x, this.location.y, this.r, 0,2 * Math.PI, false);
    ctx.lineWidth = 3;
    if (this.highlight) {
      ctx.strokeStyle="#f00";
    } else {
      ctx.strokeStyle="#60b0df";
    }
    ctx.stroke();

    if(typeof this.connects != 'undefined')
    {
      for(let c of this.connects)
      {
        let d=this.dist(this.location.x,this.location.y,c.location.x,c.location.y);
        let r =Math.random();
        if(d<cRange&&d>4)
        {
          ctx.beginPath();
          ctx.strokeStyle="#60b0df";
          ctx.moveTo(this.location.x, this.location.y);
          ctx.lineTo(c.location.x, c.location.y);
          ctx.stroke();
        }
      }
      this.connects=[];
    }
  }
}
