function Ray(origin, direction, t_min, t_max) {
  this.origin = origin || new Vector(0,0,0);
  this.direction = direction || new Vector(1,0,0);
  this.t_min = t_min || 0;
  this.t_max = t_max || Number.MAX_VALUE;
}

Ray.prototype = {
  getLoc: function(t) {
    return this.origin.add(this.direction.multiply(t));
  },
  getTransformedLoc: function(t, transformation) {
    var d = multiplyglMatrix(transformation, this.direction, 0);
    var e = multiplyglMatrix(transformation, this.origin, 1);

    return e.add(d.multiply(t)); 
  }
}
