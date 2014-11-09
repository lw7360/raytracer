function Camera(campos, camdir, camright, camup, ll, lr, ul, ur, width, height) {
  // Our "Eye"
  this.campos = campos || new Vector(0,0,0);
  this.camdir = camdir || new Vector(0,0,1);
  this.camright = camright || new Vector(0,0,0);
  this.camup= camup || new Vector(0,0,0);

  this.ul = ul || new Vector(-1,  1, -1);
  this.ur = ur || new Vector( 1,  1, -1);
  this.lr = lr || new Vector( 1, -1, -1);
  this.ll = ll || new Vector(-1, -1, -1);

  // Width and Height in pixels.
  this.width = width || 1000;
  this.height = height || 500;

  this.imWidth = Math.abs(this.ul.x - this.ur.x);
  this.imHeight = Math.abs(this.ul.y - this.lr.y);

  if (this.lr.z - this.ll.z) {
    this.imZ = this.lr.z - this.ll.z;
    this.x = true;
  }
  else {
    this.imZ = this.ul.z - this.ll.z;
    this.x = false;
  }

  this.genRay = function(x, y) {
    var u = (x+0.5)/this.width;
    var v = (y+0.5)/this.height;
    var dir = this.ll.multiply(v).add(this.ul.multiply(1-v)).multiply(u);
    dir = dir.add(this.lr.multiply(v).add(this.ur.multiply(1-v)).multiply(1-u));

    return new Ray(this.campos, dir.subtract(this.campos));
  }
}
