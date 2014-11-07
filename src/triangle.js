// a, b, c are the vertices of the triangle, represented as vectors.
function Triangle(a, b, c, material, transformation, vertexNormals) {
  this.a = a || new Vector(0,0,0);
  this.b = b || new Vector(0,1,0);
  this.c = c || new Vector(1,0,0);

  this.material = material || new Material();

  this.transformation = transformation || mat4.create();
  this.invTran = mat4.create();
  mat4.invert(this.invTran, this.transformation);

  this.u = this.b.subtract(this.a);
  this.v = this.c.subtract(this.a);
  this.normal = this.u.cross(this.v).normalize();

  this.vertexNormals = vertexNormals || [];

  this.checkIntersect = function(ray) {
    //var dir = ray.direction;
    //var w0 = ray.origin.subtract(this.a);

    var dir = multiplyglMatrix(this.invTran, ray.direction, 0);
    var w0 = multiplyglMatrix(this.invTran, ray.origin, 1);

    var a = - this.normal.dot(w0);
    var b = this.normal.dot(dir);

    if (Math.abs(b) < 0.00000000000001) {
      return false; // Parallel
    }

    var r = a/b;
    if (r < 0) {
      return 0;
    }

    var intersectPoint = w0.add(dir.multiply(r));

    var uu = this.u.dot(this.u);
    var uv = this.u.dot(this.v);
    var vv = this.v.dot(this.v);
    
    var w = intersectPoint.subtract(this.a);
    var wu = w.dot(this.u);
    var wv = w.dot(this.v);
    
    var D = uv * uv - uu * vv;

    var s = (uv * wv - vv * wu) / D;
    if (s < 0 || s > 1) {
      return false;
    }
    var t = (uv * wu - uu * wv) / D;
    if (t < 0 || (s+t) > 1) {
      return false;
    }

    return [r, r]; // Reasons.

  }

  this.getNormal = function(pos) {
    if ((pos instanceof Vector) && this.vertexNormals.length === 3){
      try {
        var totArea = getTriArea(this.a, this.b, this.c);
        var A = getTriArea(pos, this.b, this.c);
        var B = getTriArea(pos, this.a, this.c);
        var C = getTriArea(pos, this.a, this.b);

        return this.vertexNormals[0].multiply(A).add(this.vertexNormals[1].multiply(B).add(this.vertexNormals[2].multiply(C))).divide(totArea).normalize();
      } catch (e) {
        return this.normal;
      }
    }
    else {
      return this.normal;
    }
  }

}
