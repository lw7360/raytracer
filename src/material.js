function Material(ambient, diffuse, specular, specularExponent, reflective) {
  // All colors with values in the range 0,1.
  this.ambient = ambient || new Color(1,1,1);
  this.diffuse = diffuse || new Color(1,1,1);
  this.specular = specular || new Color(1,1,1);
  this.specularExponent = specularExponent || 16;
  this.reflective = reflective || new Color(1,1,1);
}
