function Scene(mainFiles, objFiles, width, height) {
  this.width = width || 500;
  this.height = height || 500;
  this.depth = 1;

  this.X = new Vector(1,0,0);
  this.Y = new Vector(0,1,0);
  this.Z = new Vector(0,0,1);

  // Our camera's positions
  this.campos = new Vector(0, 0, 0);
  // Where we want our camera to look at.
  this.look_at = new Vector(0,0,0);
  // Difference from where our camera is and where we want to look at.
  this.diff_btw = this.campos.subtract(this.look_at);
  // Normalized vector in the opposite direction of diff_btw.
  this.camdir = this.diff_btw.negative().normalize();
  this.camright = this.Y.cross(this.camdir).normalize();
  this.camup = this.camright.cross(this.camdir).normalize();

  // Now initialize our camera.
  //this.camera = new Camera(this.campos, this.camdir, this.camright, this.camup, null, null, null, null, this.width, this.height);

  this.rayTracer = new RayTracer();

  // Test Stuff
  //var normColor = new Color(1,1,1);
  //var perfMaterial = new Material(normColor, normColor, normColor, 16, normColor);
  //this.rayTracer.addSphere(new Vector(0, 0, -2), 1, perfMaterial);
  //this.rayTracer.addDirectionalLight(new Vector(0, 0, -1), new Color(153, 153, 153));
  //this.rayTracer.addAmbientLight(new Color(25,25,25));


  // Test 1
  /*
  this.camera = new Camera(new Vector(0,0,100), null, null, null, new Vector(-50, -50, 0), new Vector(50, -50, 0), new Vector(-50, 50, 0), new Vector(50, 50, 0), this.width, this.height);
  this.rayTracer.addAmbientLight(new Color(0.1, 0.1, 0.1));
  this.rayTracer.addPointLight(new Vector(200, 200, 200), new Color(0.6, 0.6, 0.6), 0);
  var newMat = new Material(new Color(0.1, 0.1, 0), new Color(1, 1, 0), new Color(0.8, 0.8, 0.8), 16, new Color(0,0,0));
  this.rayTracer.addSphere(new Vector(0, 0, -50), 45, newMat);
  */

  // Test 2
  /*
  this.camera = new Camera(new Vector(0,0,100), null, null, null, new Vector(-50, -50, 0), new Vector(50, -50, 0), new Vector(-50, 50, 0), new Vector(50, 50, 0), this.width, this.height);
  this.rayTracer.addAmbientLight(new Color(0.1, 0.1, 0.1));
  this.rayTracer.addPointLight(new Vector(-50, -50, 50), new Color(1, 0, 1), 0);
  this.rayTracer.addPointLight(new Vector(150, 150, -75), new Color(1, 1, 1), 0);
  this.rayTracer.addPointLight(new Vector(30, -40, 80), new Color(1, 1, 0), 0);
  this.rayTracer.addPointLight(new Vector(10, 20, 30), new Color(0, 1, 1), 0);
  var newMat = new Material(new Color(0.1, 0.1, 0.1), new Color(0.1, 0.1, 0.1), new Color(0.5, 0.5, 0.5), 5, new Color(0,0,0));
  this.rayTracer.addSphere(new Vector(0, 0, -50), 45, newMat);
  */

  // Test 3
  /*
  this.camera = new Camera(new Vector(0,0,100), null, null, null, new Vector(-50, -50, 0), new Vector(50, -50, 0), new Vector(-50, 50, 0), new Vector(50, 50, 0), this.width, this.height);
  this.rayTracer.addAmbientLight(new Color(0.1, 0.1, 0.1));
  this.rayTracer.addDirectionalLight(new Vector(0, 0.2, -1), new Color(1, 1, 1));
  this.rayTracer.addDirectionalLight(new Vector(1, -1, -1), new Color(0.5, 0, 0));
  this.rayTracer.addDirectionalLight(new Vector(-1, -1, -1), new Color(0, 1, 0));
  this.rayTracer.addPointLight(new Vector(100, 100, 300), new Color(0, 0.1, 0));
  this.rayTracer.addPointLight(new Vector(-40, -60, -80), new Color(0, 1, 1));
  var newMat = new Material(new Color(0,0,0.1), new Color(0,0,0.3), new Color(0.5,0.5,0.5), 36, new Color(0,0,0));
  this.rayTracer.addSphere(new Vector(0, 0, -50), 45, newMat);
  */

  // Test 4
  /* 
  this.camera = new Camera(new Vector(0,0,100), null, null, null, new Vector(-50, -50, 0), new Vector(50, -50, 0), new Vector(-50, 50, 0), new Vector(50, 50, 0), this.width, this.height);
  this.rayTracer.addAmbientLight(new Color(0.1, 0.1, 0.1));
  this.rayTracer.addPointLight(new Vector(200, 0, -50), new Color(1,1,1));
  //this.rayTracer.addDirectionalLight(new Vector(-1, 0, 0), new Color(1,1,1));
  var newMat = new Material(new Color(0.3, 0.15, 0), new Color(0.8, 0.4, 0), new Color(0.8, 0.4, 0), 30, new Color(0,0,0));
  this.rayTracer.addSphere(new Vector(-30, 0, -50), 25, newMat);
  this.rayTracer.addSphere(new Vector( 30, 0, -50), 25, newMat);
  */

  parseInput(this, mainFiles, objFiles);

  this.render = function() {
    ctx = document.getElementById('canvas');
    ctx.height = this.height;
    ctx.width = this.width;
    for (var x = 0; x < this.width; x++) {
      for (var y = 0; y < this.height; y++) {
        var ray = this.camera.genRay(x, y);
        var pixelColor = this.rayTracer.rayTrace(ray, 1).multiply(255).round().bound(0, 255);
        drawPixel(pixelColor.r, pixelColor.g, pixelColor.b, this.width-x-1, y); // flip x cause reasons???
      }
    }
  }
}

var parseInput = function(scene, input) {
  var lines = input.match(/[^\r\n]+/g);
  var currentMaterial = new Material(); // Base material.
  var currentTransform = mat4.create();
  var i = lines.length;
  while (i > 0 && lines.length > 0) {
    try {
      var words = lines.shift();
      var words = words.match(/\S+/g);
      //console.log(words);
      i--;
      
      var args = [];
      var firstWord = words[0];

      if (firstWord === 'cam') { // Camera
        for (var i = 1, len = words.length; i < len; i++) {
          args.push(Number.parseFloat(words[i])); 
        }
        scene.camera = new Camera(new Vector(args[0], args[1], args[2]), null, null, null, new Vector(args[3], args[4], args[5]), new Vector(args[6], args[7], args[8]), new Vector(args[9], args[10], args[11]), new Vector(args[12], args[13], args[14]), scene.width, scene.height);
      }

      else if (firstWord === 'sph') { // Sphere
        for (var i = 1, len = words.length; i < len; i++) {
          args.push(Number.parseFloat(words[i])); 
        }
        scene.rayTracer.addSphere(new Vector(args[0], args[1], args[2]), args[3], currentMaterial, currentTransform);
      }

      else if (firstWord === 'tri') { // Triangle
        for (var i = 1, len = words.length; i < len; i++) {
          args.push(Number.parseFloat(words[i])); 
        }
        scene.rayTracer.addTriangle(new Vector(args[0], args[1], args[2]), new Vector(args[3], args[4], args[5]), new Vector(args[6], args[7], args[8]), currentMaterial, currentTransform); 
      }

      else if (firstWord === 'obj') { // Object file
        var obj = objFiles[words[1]];
        parseObj(scene, obj, currentMaterial, currentTransform);
      }

      else if (firstWord === 'ltp') { // Point Light
        for (var i = 1, len = words.length; i < len; i++) {
          args.push(Number.parseFloat(words[i])); 
        }
        args.push(0); // Incase falloff isn't specified
        scene.rayTracer.addPointLight(new Vector(args[0], args[1], args[2]), new Color(args[3], args[4], args[5]), args[6]);
      }

      else if (firstWord === 'ltd') { // Directional Light
        for (var i = 1, len = words.length; i < len; i++) {
          args.push(Number.parseFloat(words[i])); 
        }
        scene.rayTracer.addDirectionalLight(new Vector(args[0], args[1], args[2]), new Color(args[3], args[4], args[5]));
      }

      else if (firstWord === 'lta') { // Ambient Light
        for (var i = 1, len = words.length; i < len; i++) {
          args.push(Number.parseFloat(words[i])); 
        }
        scene.rayTracer.addAmbientLight(new Color(args[0], args[1], args[2]));
      }

      else if (firstWord === 'mat') { // Material
        for (var i = 1, len = words.length; i < len; i++) {
          args.push(Number.parseFloat(words[i])); 
        }
        currentMaterial = new Material(new Color(args[0], args[1], args[2]), new Color(args[3], args[4], args[5]), new Color(args[6], args[7], args[8]), args[9], new Color(args[10], args[11], args[12]));
      }

      else if (firstWord === 'xft') { // Translation
        for (var i = 1, len = words.length; i < len; i++) {
          args.push(Number.parseFloat(words[i])); 
        }
        var tMat = mat4.create();
        tMat[3] = args[0];
        tMat[7] = args[1];
        tMat[11] = args[2];
        mat4.multiply(currentTransform, tMat, currentTransform);
      }  
      else if (firstWord === 'xfr') { // Rotation
        for (var i = 1, len = words.length; i < len; i++) {
          args.push(Number.parseFloat(words[i])); 
        }
        var u = new Vector(args[0], args[1], args[2]);
        var theta = u.magnitude();
        u = u.normalize(); // Normalize after calculating theta or theta will always be 1 lul.

        var cosTheta = Math.cos(theta * Math.PI / 180);
        var sinTheta = Math.sin(theta * Math.PI / 180);
        var rotMat = mat4.create();
        rotMat[0] = cosTheta + (u.x * u.x) * (1-cosTheta);
        rotMat[1] = u.x * u.y * (1-cosTheta) - u.z * sinTheta;
        rotMat[2] = u.x * u.z * (1-cosTheta) + u.y * sinTheta;
        rotMat[4] = u.y * u.x * (1-cosTheta) + u.z * sinTheta;
        rotMat[5] = cosTheta + u.y * u.y * (1-cosTheta);
        rotMat[6] = u.y * u.z * (1-cosTheta) - u.x * sinTheta;
        rotMat[8] = u.z * u.x * (1-cosTheta) - u.y * sinTheta;
        rotMat[9] = u.z * u.y * (1-cosTheta) + u.x * sinTheta;
        rotMat[10] = cosTheta + u.z * u.z * (1-cosTheta);

        mat4.multiply(currentTransform, rotMat, currentTransform);
      }
      else if (firstWord === 'xfs') { // Scaling
        for (var i = 1, len = words.length; i < len; i++) {
          args.push(Number.parseFloat(words[i])); 
        }
        var sMat = mat4.create();
        sMat[0] = args[0];
        sMat[5] = args[1];
        sMat[10] = args[2];
        mat4.multiply(currentTransform, sMat, currentTransform);
      
      }
      else if (firstWord === 'xfz') { // Reset Transformation
        currentTransform = mat4.create(); 
      }
    } catch (e) {
      console.log("There was an error parsing, but let's keep going!")
    }
  }
}

var parseObj = function(scene, obj, currentMaterial, currentTransform) {
  var vertices = [];
  var normals = [];
  var lines = obj.match(/[^\r\n]+/g);
  //console.log(lines);

  for (var j = 0; j < lines.length; j++) {
    var words = lines[j];
    var words = words.match(/\S+/g);
    
    var args = [];
    var firstWord = words[0];

    //console.log(words);

    if (firstWord === 'v') {
      for (var i = 1, len = words.length; i < len; i++) {
        args.push(Number.parseFloat(words[i])); 
      }
      vertices.push(new Vector(args[0], args[1], args[2]));
    }
    else if (firstWord === 'vn') {
      for (var i = 1, len = words.length; i < len; i++) {
        args.push(Number.parseFloat(words[i])); 
      }
      normals.push(new Vector(args[0], args[1], args[2]));
    }
    else if (firstWord === 'f') {
      var verts = [];
      var norms = [];
      for (var i = 1, len = words.length; i < len; i++) {
        if (words[i].indexOf('//') > -1) {
          var vn = words[i].split('//');
          verts.push(vertices[Number.parseInt(vn[0]) - 1]);
          norms.push(normals[Number.parseInt(vn[1]) - 1]);
        }
        else {
          verts.push(vertices[Number.parseInt(words[i]) - 1]);
        }
      }
      scene.rayTracer.addTriangle(verts[0], verts[1], verts[2], currentMaterial, currentTransform, norms);
    } 
  }
}
