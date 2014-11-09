function PointLight(position, color, falloff) {
  this.pos = position;
  this.color = color;
  this.falloff = falloff || 0;
}

PointLight.prototype = {
  getLightVector: function(surface) {
    return this.pos.subtract(surface).normalize();
  },
  getDistFrom: function(vec) {
    return this.pos.subtract(vec).length();
  }
}
