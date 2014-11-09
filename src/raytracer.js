function RayTracer() {
  this.objects = [];
  this.pointLights = [];
  this.directionalLights = [];
  this.ambientLight = new Color(0, 0, 0);

  this.addSphere = function(center, radius, material, transformation) {
    this.objects.push(new Sphere(center, radius, material, transformation));
  }

  this.addTriangle = function(a, b, c, material, transformation, vertexNormals) {
    this.objects.push(new Triangle(a, b, c, material, transformation, vertexNormals));  
  }

  this.addPointLight = function(position, color, falloff) {
    this.pointLights.push(new PointLight(position, color, falloff)); 
  }

  this.addDirectionalLight = function(direction, color) {
    this.directionalLights.push(new DirectionalLight(direction, color)); 
  }

  this.addAmbientLight = function(color) {
    this.ambientLight = this.ambientLight.add(color); 
  }

  this.rayTrace = function(ray, depth, bounced) {
    var curColor = new Color(0,0,0);
    if (depth > -1) {
      var closestObj = null;
      var smallestT = Number.MAX_VALUE;

      for (var o in this.objects) {
        if (this.objects[o] === bounced) {
          continue;
        }
        var intersection = this.objects[o].checkIntersect(ray);
        if (intersection && intersection[0] < smallestT) {
          smallestT = intersection[0];
          closestObj = this.objects[o];
        }
        else if (intersection && intersection[1] < smallestT) {
          smallestT = intersection[1];
          closestObj = this.objects[o];
        }
      }

      if (closestObj !== null) {
        var intersectWS = ray.getLoc(smallestT); // Location of ray hitting sphere. World Space
        var intersect = ray.getTransformedLoc(smallestT, closestObj.invTran); // Intersect in Object Space
        var mat = closestObj.material;
        
        if (closestObj instanceof Sphere) { // Sphere Time
          //var cent = multiplyglMatrix(closestObj.transformation, closestObj.center, 1);
          var cent = closestObj.center;
          var norm = intersect.subtract(cent);
          var invTranspose = mat4.create();
          mat4.transpose(invTranspose, closestObj.invTran);
          norm = multiplyglMatrix(invTranspose, norm, 0).normalize();
        }
        else { // Triangle Time
          var norm = closestObj.getNormal(intersectWS);
          var invTranspose = mat4.create();
          mat4.transpose(invTranspose, closestObj.invTran);
          norm = multiplyglMatrix(invTranspose, norm, 0).normalize();
        }

        curColor = curColor.add(this.ambientLight.multiply(mat.ambient)); // Handle Ambient.

        for (var i in this.directionalLights) { // Handle direction lights.
          var light = this.directionalLights[i];
          curColor = curColor.add(light.color.multiply(mat.ambient)); // Ambient Stuff
          var lightVec = light.getLightVector();

          var shadowRay = new Ray(intersectWS, lightVec);
          var blocked = false;

          for (var o in this.objects) {
            var intersection = this.objects[o].checkIntersect(shadowRay);
            if (intersection && this.objects[o] !== closestObj) {
              blocked = true;
              break;
            }
          }

          if (!blocked) { // Shadow Ray Check.
            // Diffuse
            var diffuse = mat.diffuse.multiply(light.color.multiply(Math.max(0, norm.dot(lightVec))));
            curColor = curColor.add(diffuse);

            // Specular
            var specExp = mat.specularExponent;
            var viewer = ray.direction.normalize().negative();
            var reflected = lightVec.negative().add(norm.multiply(lightVec.dot(norm) * 2)); 
            var specScaling = Math.pow(Math.max(reflected.dot(viewer), 0), specExp);
            var specular = mat.specular.multiply(light.color.multiply(specScaling));
            curColor = curColor.add(specular);
          }
        }

        for (var i in this.pointLights) { // Handle point lights.
          var light = this.pointLights[i];
          curColor = curColor.add(light.color.multiply(mat.ambient)); // Ambient Stuff
          var lightVec = light.getLightVector(intersectWS);

          var shadowRay = new Ray(intersectWS, light.pos.subtract(intersectWS));
          var blocked = false;

          for (var o in this.objects) {
            var intersection = this.objects[o].checkIntersect(shadowRay);
            if (intersection && this.objects[o] !== closestObj) {
              if ((intersection[0] < 1 && intersection[0] >= 0) || (intersection[1] < 1 && intersection[1] >= 0)) {
                blocked = true;
                break;
              } 
            }
          }

          if (!blocked) {
            // Diffuse
            var diffuse = mat.diffuse.multiply(light.color.multiply(Math.max(0, norm.dot(lightVec))));
            curColor = curColor.add(diffuse.divide(Math.pow(light.getDistFrom(intersect), light.falloff)));
            // Specular
            var specExp = mat.specularExponent;
            var viewer = ray.direction.normalize().negative();
            var reflected = lightVec.negative().add(norm.multiply(lightVec.dot(norm) * 2)); 
            var specScaling = Math.pow(Math.max(reflected.dot(viewer), 0), specExp);
            var specular = mat.specular.multiply(light.color.multiply(specScaling));
            curColor = curColor.add(specular.divide(Math.pow(light.getDistFrom(intersect), light.falloff)));
          }
        }
        // Reflection time.
        var reflDir = ray.direction.subtract(norm.multiply(2 * ray.direction.dot(norm)));
        curColor = curColor.add(mat.reflective.multiply(this.rayTrace(new Ray(intersectWS, reflDir), depth-1, closestObj)));
      }

      return curColor;
    }
    else { // We've gone deep enough.
      return new Color(0, 0, 0);
    }
  }
}
