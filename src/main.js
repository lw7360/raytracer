var main = function(mainFiles, objFiles, width, height) {
  //var scene = new Scene(obj); 
  window.scene = new Scene(mainFiles, objFiles, width, height);
  window.scene.render();
}

var drawPixel = function(r, g, b, x, y) {
  var ctx = document.getElementById('canvas').getContext('2d');
  ctx.fillStyle = 'rgb('+r+','+g+','+b+')';
  ctx.fillRect(x, y, 1, 1);
}

var multiplyglMatrix = function(mat, vec, homogeneous) {
  // mat = 4x4 gl-matrix Last row doesn't really matter
  // vec = standard vector.js vector. 

  var retVec = new Vector();
  retVec.x = mat[0] * vec.x + mat[1] * vec.y + mat[2] * vec.z + mat[3] * homogeneous;
  retVec.y = mat[4] * vec.x + mat[5] * vec.y + mat[6] * vec.z + mat[7] * homogeneous;
  retVec.z = mat[8] * vec.x + mat[9] * vec.y + mat[10] * vec.z + mat[11] * homogeneous;

  return retVec;
}

var getTriArea = function(x, y, z) {
  return 0.5 * (z.subtract(x).cross(y.subtract(x)).length());
}
