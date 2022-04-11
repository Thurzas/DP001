class V
{
  constructor(x,y)
  {
    this.x=x;
    this.y=y;
  }

  sub(other){
    let vv=this.copy();
    if(typeof other == 'number')
    {
      vv.x-=other;
      vv.y-=other;
    }
    else {
      vv.x-=other.x;
      vv.y-=other.y;
    }
    return vv;
  }

  add(other){
    let vv=this.copy();
    if(typeof other == 'number')
    {
      vv.x+=other;
      vv.y+=other;
    }
    else {
      vv.x+=other.x;
      vv.y+=other.y;
    }
    return vv;
  }

  mult(other)
  {
    let vv=this.copy();
    if(typeof other == 'number')
    {
      vv.x*=other;
      vv.y*=other;
    }
    else {
      vv.x*=other.x;
      vv.y*=other.y;
    }
    return vv;
  }

  div(other)
  {
    let vv=this.copy();
    if(typeof other == 'number' && other!=0)
    {
      vv.x/=other;
      vv.y/=other;
    }
    else {
      vv.x/=other.x;
      vv.y/=other.y;
    }
    return vv;
  }

  mag() {
    return Math.sqrt(this.x*this.x + this.y*this.y);
  }
  normalize() {
    var vv=this.copy();
    var m = this.mag();
    if (m != 0 && m != 1) {
      vv=vv.div(m);
    }
    return vv;
  }
  setMag(len) {
    let vv=this.copy();
    vv=vv.normalize();
    vv=vv.mult(len);
    return vv;
  }
  limit(max) {
    let vv=this.copy();
    if ((this.x*this.x + this.y*this.y) > max*max) {
      vv=vv.normalize();
      vv=vv.mult(max);
    }
    return vv;
  }
  isNull()
  {
    return this.x==0&&this.y==0;
  }
  heading()
  {
    let angle = Math.atan2(this.y, this.x);
    return angle;
  }
  copy()
  {
    return new V(this.x,this.y);
  }
}
