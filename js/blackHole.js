class blackHole{
  constructor(x,y){
    this.v=new V(0,0);
    this.a=new V(0,0);
    this.mass=600000;
    this.location= new V(x,y);
    this.disk=new Circle(x,y,30);
    this.col=false;
  }

  setHighlight(bool){
  }

  ApplyForce(f)
  {

  }
  attract(p){
      let u =new V(p.location.x-this.location.x,p.location.y-this.location.y);
      let d = u.mag();
      let force= G*this.mass*p.mass/(d*d);
      let theta = Math.atan2(u.y,u.x);
      let fx=Math.cos(theta)*force;
      let fy=Math.sin(theta)*force;
      let f=new V(-fx,-fy);
      let ff= new V(Math.cos(90*Math.PI/180)*fx-Math.sin(90*Math.PI/180)*fy*spin,
                    Math.sin(90*Math.PI/180)*fx + Math.cos(90*Math.PI/180)*fy*spin);
      return ff.add(f);
  }

  dist(x,y,xx,yy) {
    let dx = x - xx;
    let dy = y - yy;
    return Math.sqrt(dx*dx + dy*dy);
  }

  intersects(other) {
    let d = this.dist(this.location.x, this.location.y, other.location.x, other.location.y);
    return d < this.disk.r + other.r;
  }
  render(ctx) {
    ctx.beginPath();
    ctx.arc(this.location.x, this.location.y, this.disk.r, 0,2 * Math.PI, false);
    ctx.strokeStyle="#fff";
    ctx.lineWidth = 6;
    ctx.stroke();
  }
  update() {
  }
}
