function Sphere(center, radius, material, transformation) {
  this.center = center || new Vector(0,0,0);
  this.radius = radius || 1;
  this.material = material || new Material();
  this.transformation = transformation || mat4.create();
  this.invTran = mat4.create();
  mat4.invert(this.invTran, this.transformation);

  this.checkIntersect = function(ray) {
    var d = multiplyglMatrix(this.invTran, ray.direction, 0);
    var e = multiplyglMatrix(this.invTran, ray.origin, 1);

    //var d = ray.direction;
    //var e = ray.origin;
    var c = this.center;
    var r = this.radius;

    var discriminant = Math.pow(d.dot(e.subtract(c)), 2);
    discriminant = discriminant - (d.dot(d) * (e.subtract(c).dot(e.subtract(c)) - r*r));

    if (discriminant === 0) {
      //return [d.negative().dot(e.subtract(c))/(d.dot(d))];
      var x = d.negative().dot(e.subtract(c))/(d.dot(d));
      if (x >= 0) {
        return [d.negative().dot(e.subtract(c))/(d.dot(d)), Number.MAX_VALUE];
      }
      else {
        return false;
      }
    }
    else if (discriminant > 0) {
      //return [(d.negative().dot(e.subtract(c)) + discriminant)/(d.dot(d)), (d.negative().dot(e.subtract(c)) - discriminant)/(d.dot(d))];
      var retArr = [];
      var x = (d.negative().dot(e.subtract(c)) - Math.sqrt(discriminant))/(d.dot(d));
      var y = (d.negative().dot(e.subtract(c)) + Math.sqrt(discriminant))/(d.dot(d));

      if (x >= 0) {
        retArr.push(x); 
      }
      if (y >= 0) {
        retArr.push(y);
      }
      
      if (retArr.length === 0) {
        return false;
      }
      else {
        while (retArr.length < 2) {
          retArr.push(Number.MAX_VALUE);
        }
        return retArr;
      }
    }
    else {
      return false;
    }
  }
}
