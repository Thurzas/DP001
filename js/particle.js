class Particle {
  constructor(x, y) {
    this.mass=Math.random()*100+1;
    this.location=new V(x,y);
    this.v=new V(0,0);
    this.r = this.mass/10;
    this.a=new V(0,0);
    this.highlight = false;
    this.maxSpeed=4;
    this.maxForce=0.1;
    this.connects=[];
    this.wander();
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
  eat(p)
  {
   if(this.mass<100)
    {
      this.mass+=p.mass;
      this.r=this.mass*0.1;
    }
    p.location=getRandomPointInCircle(this.location.x,this.location.y,pRange);
    p.v=new V(0,0);
    p.a=new V(0,0);
    p.mass=Math.random()*20+1;
    p.r=p.mass*0.1;
  }
  setHighlight(value) {
    this.highlight = value;
  }

  Connect(){
    this.r=Math.random();
  }

  line(other){
    this.connects.push(other);
  }

  attract(p,circular){
    let u =new V(p.location.x-this.location.x,p.location.y-this.location.y);
    let d = u.mag();
    let force= G*this.mass*p.mass/(d*d);
    let theta = Math.atan2(u.y,u.x);
    let fx=Math.cos(theta)*force;
    let fy=Math.sin(theta)*force;
    let f=new V(-fx,-fy);
    let ff = new V(0,0);
    /*if(circular)
      ff= new V(Math.cos(90*Math.PI/180)*fx-Math.sin(90*Math.PI/180)*fy*spin,
                  Math.sin(90*Math.PI/180)*fx + Math.cos(90*Math.PI/180)*fy*spin);
    */
    return f;
}

  update(ctx) {
    this.v=this.v.add(this.a);
    this.v=this.v.limit(this.maxSpeed);
    this.location=this.location.add(this.v);
    this.a.x=0;
    this.a.y=0;
    if(this.location.x>ctx.width)
    {
      this.location.x=0;
      this.connects=[];
    }
    if(this.location.y>ctx.height)
    {
     this.location.y=0;
     this.connects=[];
    }
    if(this.location.x<0)
    {
      this.location.x=ctx.width;
      this.connects=[];
    }
    if(this.location.y<0)
    {
      this.location.y=ctx.height;
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
    let rad=15;
    let p =this.polar((this.v.heading()+Math.random()*360)*Math.PI/180,rad/2);
    let target=this.v.copy();
    let range=10;
    if(!this.v.isNull())
    target.setMag(range);
    target=target.add(this.location);
    target=target.add(p);
    this.seek(target);

  }

  render(ctx) {

    ctx.beginPath();
    ctx.arc(this.location.x, this.location.y, this.r, 0,2 * Math.PI, false);
    ctx.lineWidth = 3;
    if (this.highlight) {
      ctx.strokeStyle=colorh;
    } else {
      ctx.strokeStyle=color;
    }
    ctx.stroke();
    if(this.connects != 'undefined')
    {
      for(let c of this.connects)
      {
        let d=this.dist(this.location.x,this.location.y,c.location.x,c.location.y);
        let r =Math.random();
        if(d<pRange&&d>4)
        {
          ctx.beginPath();
          ctx.strokeStyle=color;
          ctx.moveTo(this.location.x, this.location.y);
          ctx.lineTo(c.location.x, c.location.y);
          ctx.stroke();
        }
      }
      this.connects=[];
    }
  }
}
