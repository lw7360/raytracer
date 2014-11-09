function DirectionalLight(direction, color) {
  this.dir = direction;
  this.color = color;
}

DirectionalLight.prototype = {
  getLightVector: function() {
    return this.dir.negative().normalize();
  }
}
