window.mainFile = "";
window.objFiles = {};
window.onload = function() {
  var fileInput = document.getElementById('fileInput');

  fileInput.addEventListener('change', function(e) {
    var file = fileInput.files[0];
    reader = new FileReader();

    reader.onload = function(e) {
      console.log(reader.result);
      window.mainFile = reader.result; 
    }

    reader.readAsText(file);        
  });

  var objInput = document.getElementById('objInput');

  objInput.addEventListener('change', function(e) {
    var file = objInput.files[0];
    reader2 = new FileReader();

    reader2.onload = function(e) {
      window.objFiles[$("#objName").val()] = reader2.result;

      if (objFiles.length > 0) {
        window.objFiles[objName] = objText;
        $("#curObjs").text("Current Objects: " + Object.keys(objFiles));
      }
    }
  
    reader2.readAsText(file);
  });

  $("#render").click(function() {
    main(window.mainFile, window.objFiles, $("#widthField").val(), $("#heightField").val());
  });
  $("#insertObj").click(function() {
    var objName = $("#objName").val();
    var objText = $("#objText").val();

    if (objName.length > 0) {
      window.objFiles[objName] = objText;
      $("#curObjs").text("Current Objects: " + Object.keys(objFiles));
    }
  });
  $("#download").click(function() {
    var canvas = document.getElementById('canvas');
    var image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
    window.location.href=image;
  });
}
