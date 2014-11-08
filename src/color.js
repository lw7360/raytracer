function Color(r, g, b) {
  this.r = r || 0;
  this.g = g || 0;
  this.b = b || 0;
}

// Instance Methods.
Color.prototype = {
  add: function(v) {
    if (v instanceof Color) return new Color(this.r + v.r, this.g + v.g, this.b + v.b);
    else return new Color(this.r + v, this.g + v, this.b + v);
  },
  subtract: function(v) {
    if (v instanceof Color) return new Color(this.r - v.r, this.g - v.g, this.b - v.b);
    else return new Color(this.r - v, this.g - v, this.b - v);
  },
  multiply: function(v) {
    if (v instanceof Color) return new Color(this.r * v.r, this.g * v.g, this.b * v.b);
    else return new Color(this.r * v, this.g * v, this.b * v);
  },
  divide: function(v) {
    if (v instanceof Color) return new Color(this.r / v.r, this.g / v.g, this.b / v.b);
    else return new Color(this.r / v, this.g / v, this.b / v);
  },
  clone: function() {
    return new Color(this.r, this.g, this.b);
  },
  floor: function() {
    return new Color(Math.floor(this.r), Math.floor(this.g), Math.floor(this.b));
  },
  ceil: function() {
    return new Color(Math.ceil(this.r), Math.ceil(this.g), Math.ceil(this.b));
  },
  round: function() {
    return new Color(Math.round(this.r), Math.round(this.g), Math.round(this.b));
  },
  bound: function(min, max) {
    var r = this.r;
    var g = this.g;
    var b = this.b;

    if (r > max) r = max;
    if (r < min) r = min;
    if (g > max) g = max;
    if (g < min) g = min;
    if (b > max) b = max;
    if (b < min) b = min;

    return new Color(r, g, b);
  }
}


// Static Methods (To come later if I need them).
