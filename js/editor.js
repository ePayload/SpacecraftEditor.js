// Grid calculation  
var cos30 = Math.cos(Math.PI / 6);
var sin30 = Math.sin(Math.PI / 6);
var Pi2 = Math.PI * 2;

var step = 15;
var stepz = 10;
var _halfstep = 2.5; //m
var _poshalf = 1; //2; 
var _addframes = true;
var _accuracy_step = 0.1; //m // index accuracy == 100; // *100
var version = "0.31";

//isShiftDown = 0x02, isCtrlDown = 0x01; //--- sel 

//Math.round(point.z * stepz*10)/10*_poshalf

// *100
function to_hex_100(point, noneZ) {
  var m = Math.floor(2 * point.y / step*2);
  var l = Math.floor(2 * (sin30 * point.y + cos30 * point.x) / step*2);
  var r = Math.floor(2 * (sin30 * point.y - cos30 * point.x) / step*2);
  var y = Math.floor((l - r + 1) / 3.0)*0.5;
  var x = Math.floor((m + r + 2) / 3.0)*0.5 + Math.floor(y / 2);
  return new THREE.Vector3(x, y, Math.round(point.z * (noneZ ? 1 : 2) / stepz * 100)/(noneZ ? 1 : 2) / 100);
}
function from_hex_100(point) {
  var dy = point.y % 2;
  dy = (dy < 0) ? Math.abs(dy + 2) : dy;
  var y = point.y * step  * cos30;
  var x = point.x * step + dy * step * sin30;
  
  return new THREE.Vector3(Math.round(y*10)/10, Math.round(x * 100) / 100, point.z * stepz);
}
// *100

//+++ step = 15/2 >
// only for step/2
function to_hex_half(point, noneZ) {
  var m = Math.floor(2 * point.y / step*2);
  var l = Math.floor(2 * (sin30 * point.y + cos30 * point.x) / step*2);
  var r = Math.floor(2 * (sin30 * point.y - cos30 * point.x) / step*2);
  var y = Math.floor((l - r + 1) / 3.0)*0.5;
  var x = Math.floor((m + r + 2) / 3.0)*0.5 + Math.floor(y / 2);
  return new THREE.Vector3(x, y, Math.round(point.z * (noneZ ? 1 : 2) / stepz)/(noneZ ? 1 : 2));
}

// only for step/2
function from_hex_half(point) {
  var dy = point.y % 2;
  dy = (dy < 0) ? Math.abs(dy + 2) : dy;
  var y = point.y * step  * cos30;
  var x = point.x * step + dy * step * sin30;
  return new THREE.Vector3(Math.round(y*10)/10, Math.round(x*10)/10, point.z * stepz);
}

// only for step/2
function snap_half2(pos,noneZ) {
  return from_hex_half(to_hex_half(pos,noneZ));
}

function to_hex(point) {
  var m = Math.floor(2 * point.y / step *_poshalf);
  var l = Math.floor(2 * (sin30 * point.y + cos30 * point.x) / step *_poshalf);
  var r = Math.floor(2 * (sin30 * point.y - cos30 * point.x) / step *_poshalf);
  var y = Math.floor((l - r + 1) / 3.0)/_poshalf;
  var x = Math.floor((m + r + 2) / 3.0)/_poshalf + Math.floor(y / 2);
  return new THREE.Vector3(x, y, Math.round(point.z *_poshalf / stepz)/_poshalf);
}

function from_hex(point) {
//  return new THREE.Vector3(
//    point.y * step /_poshalf * cos30, 
//    point.x * step /_poshalf + Math.abs(point.y % 2) * step/_poshalf * sin30, 
//    point.z * stepz
//  );
  var dy = point.y % 2;
  dy = (dy < 0) ? Math.abs(dy + 2) : dy;
  var y = point.y * step /_poshalf * cos30;
  var x = point.x * step /_poshalf + dy * step /_poshalf * sin30;
  return new THREE.Vector3(Math.round(y*10)/10*_poshalf, Math.round(x*10)/10*_poshalf, point.z * stepz);
}
//+++ step = 15/2 <

function layer(z) {
  return Math.round(z / stepz);
}

function chek_arr(arr, f) {
  for (var i in arr) {
    if (arr[i] != undefined) {
      var ret = f(i, arr[i]);
      if (ret != undefined) return ret; //return arr[i];
    }
  }
  return undefined;
}

function find_elem(arr, elem, a_strong) {
  for (var i in arr) {
    if (arr[i] != undefined) {
      if (elem == arr[i]) return arr[i]; // if (a_strong && ===)
    }
  }
  return null;
}

function for_each(arr, f) {
  for (var i in arr) {
    if (arr[i] != undefined) {
      f(i, arr[i]);
    }
  }
}

function snap(pos) {
  return from_hex(to_hex(pos));
}

function angle_to_hex(angle, rond1) {
//  while (angle < 0) {angle += Math.PI * 2};
//  while (angle >= Math.PI * 2) {angle -= Math.PI * 2}; //!!!  while (angle >= (Math.PI * 2 - Math.PI / 6)) {angle -= Math.PI * 2};
////!!!  return Math.round(angle / Math.PI * 3);
//  return Math.round(angle / Math.PI * 3*(rond1 ? 1:2))/(rond1 ? 1:2); //!!! rot !!! 
  var a = Math.round(angle / Math.PI * 3*(rond1 ? 1:2))/(rond1 ? 1:2); //!!! rot !!! 
  while (a < 0) {a += 6};
  while (a >= 6) {a -= 6};
  return a;
}

function angle_from_hex(angle) {
  return angle * Math.PI / 3;
}

function snap_vector_to_angle(vector, rond1) {
  if (vector.y == 0 && vector.x == 0) {
    return 0;
  }
  return angle_from_hex(angle_to_hex(Math.atan2(vector.x, vector.y),rond1));
}

function to_tri(point) {
  var step_tri = step * cos30;
  var m = Math.floor(point.x / step_tri);
  var l = Math.floor((sin30 * point.x + cos30 * point.y) / step_tri);
  var r = Math.floor((sin30 * point.x - cos30 * point.y) / step_tri);

  var y = l - r;
  var x = m;

  return new THREE.Vector3(x, y, Math.round(point.z / stepz));
}

function from_tri(point) {
  return new THREE.Vector3(
    point.x * step * cos30 + step * cos30 * (2 - Math.abs((point.x + point.y) % 2)) / 3, 
    point.y * step * sin30, 
    point.z * stepz
  );
}

function tri_inv_int(x, y) {
  return !((x + y) & 1);
}

function tri_inv(point) {
  return tri_inv_int(point.x, point.y);
}

function intersect(ray, lists) {
  var intersector = null;
  for (i in lists) {
    var intersects = ray.intersectObjects(lists[i].children);
    if (intersects.length > 0) {
      if ((intersector == null) ||
          (intersector.distance > intersects[0].distance)) {
        intersector = intersects[0];
      }
    }
  }
  return intersector;
}

//+++ rot
function angle_Z_by_index(a_index) {
  m_a = a_index.split(";")[4];
  if (!m_a) return 0;
  else return parseFloat(m_a/100); // *100
}

function angle_Z_by_pos(a_pos) {
  if (a_pos.y == 0 && a_pos.x == 0) return 0;
  var a = Math.atan2(a_pos.y,a_pos.x)- Math.PI/2;
  while (a >= Math.PI * 2) {a -= Math.PI * 2};
  return a;
}

function rot_set(a_obj, a_rot) {
  if (a_rot != a_obj.posrota)
  do {a_obj.posrota = rot_next(a_obj.rotation)} while (a_rot != a_obj.posrota);
}

function rot_next(a_rotation) {
  var anglZ = a_rotation.z;
  var anglY = a_rotation.y;
  var haZ = angle_to_hex(anglZ);
  var haX = angle_to_hex(a_rotation.x);
  var haY = angle_to_hex(a_rotation.y);
  if ((haX == 0)&&(anglY == 0)){
    a_rotation.z = 0; //Math.PI/2;
    a_rotation.x = Math.PI*1.5; //angle_from_hex(4.5);
    a_rotation.y = Math.PI * 2 - anglZ;
    return 1;
  } 
  if (haX != 0){
    if (haX == 4.5){ 
      if (anglZ == 0){
        a_rotation.y = anglY + Math.PI/2; //angle_from_hex(haY+1.5);
        a_rotation.z = anglZ + Math.PI/2;
	return 2;
      } else {
	  if (haZ == 1.5) {
	    a_rotation.y = anglY + Math.PI; //angle_from_hex(haY+3);
	    a_rotation.z = anglZ + Math.PI;
	    return 3;
	  } else {
	    if (haZ == 4.5) {
	      a_rotation.x = 0;
      	      a_rotation.y = Math.PI;
      	      a_rotation.z = anglY + Math.PI/2; //angle_from_hex(haY+1.5);
	      return 4;
	    } 
	  }
      }
    } else {
      if (haX == 1.5){
	a_rotation.z = anglY;  //angle_from_hex(haY);
	a_rotation.x = 0; a_rotation.y = 0;
        return 0;
      }
    }
  } else {
    if (haY == 3){
       a_rotation.z = 0;
       a_rotation.x = Math.PI/2;
       a_rotation.y = Math.PI * 2 - anglZ;
       return 5;
    }
  }
  return 0; //???  alert("err rot");
}	    
//+++ rot

/*
//??? rot
function full_index(aMod, aPos, aRot) {
  return "" + aPos.x*100 + ";" + aPos.y*100 + ";" + aPos.z*100 + ";" + aMod + ";" 
	    + aRot.x + ";" + aRot.y + ";" + aRot.z;
}

function module_index_full(a_mod, a_pos, a_angles) {
  var ind = main_frame_index(a_pos.x, a_pos.y, a_pos.z);
  ind += ";" + a_mod;
  if (modules[a_mod].multiple) {
    ind += ";" + a_angles.z + ";" + a_angles.x + ";" + a_angles.z;
  } 
//else {
//    ind += ";" + full_index(a_mod, a_pos, a_angles);
//  }
  return ind;
}

function module_index_hr(a_mod, a_pos, a_index) { //(a_mesh) ////  if (!a_mesh) return "";
  var ind = a_mod +";"+ main_frame_index(a_pos.x, a_pos.y, a_pos.z);
//  var ind = a_pos.x*100 +";"+ a_pos.y*100 +";"+ a_pos.z*100 +";"+ a_mod;
//  if (modules[a_mod].multiple) {
    ind += ";" + (angle_Z_by_index(a_index)*100); // *100
//  }
  return ind;
}
//??? rot
*/

function pos_by_index(a_index) {
  var arr = a_index.split(";");
  return new THREE.Vector3(arr[1]/100, arr[2]/100, arr[3]/100); //*100
}

function module_index(a_mod, a_pos, a_ang) {
  var ind = a_mod + ";"+ main_frame_index(a_pos.x, a_pos.y, a_pos.z);
//  ind += ";" + a_mod; //---  ind += a_mod + ";";
//  if (modules[a_mod].multiple) {
    ind += ";" + (a_ang*100); // *100
//  }
  return ind;
}

//+++ rot +++sel
function module_by_pos(a_mod, a_pos, a_ang) { 
  return this.ship.modules[module_index(a_mod, a_pos, a_ang)];
}

//+++ rot +++sel
function main_frame_by_pos(a_mod, a_pos) { 
  return this.ship.frame_main[main_frame_zindex(a_pos.x, a_pos.y, a_pos.pos.z)];
}

function main_frame_zindex(x, y, z) { 
  return ""  + z*100 + ";" + x*100 + ";" + y*100; // *100
}

function main_frame_index(x, y, z) { //??? main_frame_index(apos,len)
//???  return "" + x*100 + ";" + y*100 + ";" + z*100; // *100
  return "" + x*100 + ";" + y*100 + ";" + z*100; // *100
}

function sec_frame_index(a_pos1, a_pos2) {
//!!! sec
//  var ind = ["x", "y", "z"];
//  var pos1, pos2;
//  for (var i = 0; i < ind.length; ++i) { //??? no i++ ?
//    if (a_pos1[ind[i]] < a_pos2[ind[i]]) {
//      pos1 = a_pos1;
//      pos2 = a_pos2;
//      return;
//    } else if (a_pos1[ind[i]] > a_pos2[ind[i]]) {
//      pos2 = a_pos1;
//      pos1 = a_pos2;
//      return;
//    }
//  }
//  return main_frame_index(pos1.x, pos1.y, pos1.z) + ";" + 
//         main_frame_index(pos2.x, pos2.y, pos2.z);

  return main_frame_index(a_pos1.x, a_pos1.y, a_pos1.z) + ";" + 
         main_frame_index(a_pos2.x, a_pos2.y, a_pos2.z);
//!!! sec

}

function shild_index(x, y) {
  return "" + x + ";" + y;
}

function shild_frame_index(a_pos1, a_pos2) {
  var ind = ["x", "y"];
  var pos1, pos2;
  for (var i = 0; i < ind.length; ++i) {
    if (a_pos1[ind[i]] < a_pos2[ind[i]]) {
      pos1 = a_pos1;
      pos2 = a_pos2;
      break;
    } else if (a_pos1[ind[i]] > a_pos2[ind[i]]) {
      pos2 = a_pos1;
      pos1 = a_pos2;
      break;
    }
  }
  return shild_index(pos1.x, pos1.y) + ";" + 
         shild_index(pos2.x, pos2.y);
}

// editor object
function editor_engine() {
  if (!Detector.webgl) {
    Detector.addGetWebGLMessage();
  }
  
  var _this = this;

  this.container;   // DOM Container
  this.stats;       // Stats
  this.loading;
  this.camera, this.scene, this.renderer;

  this.plane, this.main_axis;
  this.main_frames, this.sec_frames, this.modules, this.shilds, this.shild_frames, this.rollovers;

  this.projector;
  this.mouse2D, this.mouse3D, this.ray,
  this.rollOveredFace, this.isShiftDown = false, this.isCtrlDown = false, 
  this.isModify = false, this.isModeModify = -1; //!!!
  this.isAccuracy = false;
  
//  this.fUserface = 0; //--- sel


  this.rollOverMesh, this.voxelPosition = new THREE.Vector3(), this.tmpVec = new THREE.Vector3();
  this.symmetry = 6;
  this.circul_across = false; 

//!!!
//---  this.poshalf = 1; 
  this.axis6 = false;//0;
//!!!

  this.voxel_positions = [];
  
  /*this.mainMaterial, this.rollOverMaterial, this.delected_material;*/
  this.reflection_cube = null;
  this.i, this.intersector;
  this.frame6_geo, this.frame_6x3geo, this.frame_6x9geo;

//??? correct use
//this.shipmodules = {}; this.shipframe_main = {}; this.shipframe_sec = {}; this.shipshilds = {};

  this.ship = {
    "modules": {},
    "frame_main": {},
    "frame_sec": {},
    "shilds":{}
  }
/*  this.ship = {
    "modules": [],
    "frame_main": [],
    "frame_sec": [],
    "shilds":[]
  }*/
  
  this.cur_context = null, this.prev_context = "";
  this.modules_context = new ModulesContext(this);
  this.main_frame_context = new MainFrameContext(this);
  this.sec_frame_context = new SecFrameContext(this);
  this.shild_context = new ShildContext(this);
  this.delete_context = new DeleteContext(this);
  this.modify_context = new ModifyContext(this); //!!! sel
  this.prev_pos = []; //!!! sel
//  this.prev_matrix = new THREE.Matrix4(); //??? sel

  /*this.gui, this.editor_config = {
    "Grid Visible": true,
    "Main Axis Visible": true,
    "Grid Position": 0,
    "Symmetry": 6
  };*/

  this.load_models = function () {

    //Part of shields
    this.models_loader.load("shild_frame", "lib/models/modules/shild_frame.obj");

    for (mod in modules) {
      var model = modules[mod].model;
      this.models_loader.load(mod, "lib/models/" + model);
    }
    for (frame_name in main_frames) {
      var frame = main_frames[frame_name];
      this.models_loader.load(frame_name, "lib/models/" + frame.model);
      for (r in frame.rollovers) {
        this.models_loader.load(frame_name + r, "lib/models/" + frame.rollovers[r]);
      }
    }
    for (sec_frame_name in sec_frames) {
      var s_frame = sec_frames[sec_frame_name];
      this.models_loader.load(sec_frame_name, "lib/models/" + s_frame.model);
    }
    for (shield_name in shields) {
      var shld = shields[shield_name];
      this.models_loader.load(shield_name, "lib/models/" + shld.model);
    }
    /*for (cat in modules_cat) {
      for (mod in modules_cat[cat].modules) {
        var model = modules_cat[cat].modules[mod].model;
        this.models_loader.load(model, "lib/models/" + model);
      }
    }*/
  }

  this.create_materials = function () {
//  alert("crea mat "+ObjPropNames(materials).length);
    for (mat_name in materials) {
      var material = materials[mat_name];
      material.name = mat_name;

      // material parameters
      var ambient = 0xFFFFFF;
      var diffuse = material.diffuse_color === undefined ? new THREE.Vector3(1, 1, 1) : material.diffuse_color;
      var specular = material.specular_color === undefined ? new THREE.Vector3(0.5, 0.5, 0.5) : material.specular_color;
      var shininess = 50;

      var shader = THREE.ShaderUtils.lib["SHWnormal"];
      //var shader = THREE.ShaderUtils.lib["normal"];
      var uniforms = THREE.UniformsUtils.clone(shader.uniforms);
      
//---      var base = "textures/";

      uniforms["tNormal"].texture = this.texture_manager.get_texture("lib/textures/" + material.normal);
      uniforms["tNormal"].texture.wrapS = uniforms["tNormal"].texture.wrapT = THREE.RepeatWrapping;
      uniforms["uNormalScale"].value = 1;

      uniforms["tDiffuse"].texture = this.texture_manager.get_texture("lib/textures/" + material.diffuse);
      uniforms["tDiffuse"].texture.wrapS = uniforms["tDiffuse"].texture.wrapT = THREE.RepeatWrapping;
      uniforms["tSpecular"].texture = this.texture_manager.get_texture("lib/textures/" + material.specular);
      uniforms["tSpecular"].texture.wrapS = uniforms["tSpecular"].texture.wrapT = THREE.RepeatWrapping;

      if (material.illumination !== undefined) {
        uniforms["tAO"].texture = this.texture_manager.get_texture("lib/textures/" + material.illumination);
        uniforms["tAO"].texture.wrapS = uniforms["tAO"].texture.wrapT = THREE.RepeatWrapping;
        uniforms["enableSelIllumination"].value = true;
      } else {
        uniforms["enableSelIllumination"].value = false;
      }

      if (!this.reflection_cube) {
        var path = "skybox/pink_planet_"; //        var path = "textures/skybox/pink_planet_";
        var format = '.jpg';
        var urls = [
            path + 'pos_x' + format, path + 'neg_x' + format,
            path + 'pos_y' + format, path + 'neg_y' + format,
            path + 'neg_z' + format, path + 'pos_z' + format
          ];

        this.reflection_cube = THREE.ImageUtils.loadTextureCube(urls);
        this.reflection_cube.format = THREE.RGBFormat;
      }
      uniforms["tCube"].texture = this.reflection_cube;

      uniforms["enableAO"].value = false;
      uniforms["enableDiffuse"].value = true;
      uniforms["enableSpecular"].value = true;
      uniforms["enableReflection"].value = true;

      uniforms["uDiffuseColor"].value = diffuse;//setHex(diffuse);
      uniforms["uSpecularColor"].value = specular;//setHex(specular);
      uniforms["uAmbientColor"].value.setHex(ambient);

      uniforms["uShininess"].value = shininess;
      uniforms["uReflectivity"].value = 1;

      //uniforms["wrapRGB"].value.set(0.575, 0.5, 0.5);
      uniforms["wrapRGB"].value.set(0, 0, 0);

      var parameters = { fragmentShader: shader.fragmentShader, vertexShader: shader.vertexShader, uniforms: uniforms, lights: true };

      var uniforms_2 = THREE.UniformsUtils.clone(uniforms);
      uniforms_2["tNormal"].texture = uniforms["tNormal"].texture;
      uniforms_2["tDiffuse"].texture = uniforms["tDiffuse"].texture;
      uniforms_2["tSpecular"].texture = uniforms["tSpecular"].texture;
      uniforms_2["tAO"].texture = uniforms["tAO"].texture;
      uniforms_2["tCube"].texture = this.reflection_cube;
      uniforms_2["uDiffuseColor"].value.set(0, 1, 0);//.setHex(0x00FF00);
      uniforms_2["enableReflection"].value = true;
      uniforms_2["enableSelIllumination"].value = false;
      uniforms_2["enableSpecular"].value = false;

      var parameters_2 = { fragmentShader: shader.fragmentShader, vertexShader: shader.vertexShader, uniforms: uniforms_2, lights: true };

      var uniforms_3 = THREE.UniformsUtils.clone(uniforms);
      uniforms_3["tNormal"].texture = uniforms["tNormal"].texture;
      uniforms_3["tDiffuse"].texture = uniforms["tDiffuse"].texture;
      uniforms_3["tSpecular"].texture = uniforms["tSpecular"].texture;
      uniforms_3["tAO"].texture = uniforms["tAO"].texture;
      uniforms_3["tCube"].texture = this.reflection_cube;
      uniforms_3["uDiffuseColor"].value.set(1, 0, 0);//.setHex(0xFF0000);
      uniforms_3["enableReflection"].value = true;
      uniforms_3["enableSelIllumination"].value = false;
      uniforms_3["enableSpecular"].value = false;

      var parameters_3 = { fragmentShader: shader.fragmentShader, vertexShader: shader.vertexShader, uniforms: uniforms_3, lights: true };

      material.mainMaterial = new THREE.ShaderMaterial(parameters);
      material.mainMaterial.wrapAround = true;
      
      material.rollOverMaterial = new THREE.ShaderMaterial(parameters_2); //+++ its "selected_material"
      material.rollOverMaterial.wrapAround = true;

      material.delected_material = new THREE.ShaderMaterial(parameters_3); //!!! not selected_material
      material.delected_material.wrapAround = true;
    }

/* /Skybox (its images go into shadow)
    
    var shader = THREE.ShaderUtils.lib["cube"];
    shader.uniforms["tCube"].texture = this.reflection_cube;

    var material = new THREE.ShaderMaterial({
      fragmentShader: shader.fragmentShader,
      vertexShader: shader.vertexShader,
      uniforms: shader.uniforms, depthWrite: false
    });

    var mesh_cube = new THREE.Mesh(new THREE.CubeGeometry( 19000, 19000, 19000), material);
    mesh_cube.flipSided = true;
    mesh_cube.visible = true;
    this.scene.add(mesh_cube);
//Skybox / */

  }

  this.init = function() {
    // Container
    this.container = document.createElement('div');
    document.body.appendChild(this.container);

    // Loading...
    this.loading = document.createElement('div');
    this.loading.classList.add('loading');
    this.loading.innerText = 'Loading...';
    document.body.appendChild(this.loading);

    this.loading.style.left = "" + (window.innerWidth - parseInt(this.loading.clientWidth)) / 2 + "px";
    this.loading.style.top = "" + (window.innerHeight - parseInt(this.loading.clientHeight)) / 2 + "px";
    
    // Scene
    this.scene = new THREE.Scene();
    
    // Camera
    this.camera = new THREE.PerspectiveCamera(40, window.innerWidth/window.innerHeight, 10, 20000); //!!! 20000 for Skybox, PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
    this.camera_control = new CameraController(this.camera, this);
    this.camera.position.z = 800;
    this.scene.add(this.camera);

    // Lights
    this.ambientLight = new THREE.AmbientLight(0x151525); //0x252540
    this.scene.add(this.ambientLight);
    // Star
    this.directionalLight = new THREE.DirectionalLight(0xffffA0);
    this.directionalLight.position.set(1200, 500, 800);
    //this.directionalLight.position.set(200, -500, 200);
    this.directionalLight.castShadow = true;
    this.directionalLight.shadowCameraNear = 100;
    this.directionalLight.shadowCameraFar = 2000;
    this.directionalLight.shadowCameraLeft = -1000;
    this.directionalLight.shadowCameraRight = 1000;
    this.directionalLight.shadowCameraTop = 1000;
    this.directionalLight.shadowCameraBottom = -1000;
    //directionalLight.shadowCameraVisible = true;
    this.directionalLight.shadowBias = -0.002;
    this.directionalLight.shadowDarkness = 1.0;
    this.directionalLight.shadowMapWidth = 2048;
    this.directionalLight.shadowMapHeight = 2048;
    this.scene.add(this.directionalLight);

//!!! lampo
    // Planet
    this.directionalLight2 = new THREE.DirectionalLight(0x909080);
    this.directionalLight2.position.set(-1200, -0, -500);
    this.directionalLight2.castShadow = false;
    this.directionalLight2.intensity = 0;
    this.directionalLight2.visible = 0;
    this.scene.add(this.directionalLight2);
//!!! lampo

    // Materials
    this.create_materials();

    // Models
    this.load_models();
    
    // picking
    this.projector = new THREE.Projector();

    //??? grid
    this.plane_h = new THREE.Mesh(new THREE.TriangleGeometry(600, 900, 40, 60, false), new THREE.MeshBasicMaterial({color: 0x555555, wireframe: true}));
    this.plane_h.castShadow = false;
    this.plane_h.receiveShadow = false;
    this.scene.add(this.plane_h);

    this.plane_c = new THREE.Mesh(new THREE.TriangleGeometry(600, 900, 40, 60, true), new THREE.MeshBasicMaterial({color: 0x555555, wireframe: true}));
    this.plane_c.castShadow = false;
    this.plane_c.receiveShadow = false;
    this.scene.add(this.plane_c);
    this.plane_c.visible = false;
    this.plane = this.plane_h;

    // axis
    var geometry_axis = new THREE.Geometry();
    geometry_axis.vertices.push(new THREE.Vector3(0, 0, -1000));
    geometry_axis.vertices.push(new THREE.Vector3(0, 0, 1000));
    //geometry.computeBoundingSphere();

    var axis_material = new THREE.LineBasicMaterial({ color: 0xFFFF80, opacity: 1, linewidth: 4});
    this.main_axis = new THREE.Line(geometry_axis, axis_material, THREE.LinePieces);
    this.scene.add(this.main_axis);
    
    // Adding spaceship placeholders
    this.add_placeholders();

    this.mouse2D = new THREE.Vector3(0, 10000, 0.5);

    // Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer : true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    this.renderer.physicallyBasedShading = true;
    this.renderer.shadowMapEnabled = true;
    this.renderer.shadowMapSoft = true;

    this.container.appendChild(this.renderer.domElement);

    // Stats
    this.stats = new Stats();
    this.stats.domElement.style.position = 'absolute';
    this.stats.domElement.style.top = '0px';
    this.stats.domElement.style.left = '250px';
    extended_toolbar.appendChild(this.stats.domElement);

    // Event handlers
    window.addEventListener('resize', this.onWindowResize, false);
  	
    // add GUI
    /*this.gui = new dat.GUI();
    var gridui = this.gui.addFolder("Grid & Axis");
    gridui.add(this.editor_config, 'Main Axis Visible').onChange(function(){
      _this.main_axis.visible = _this.editor_config["Main Axis Visible"];
    });
    gridui.add(this.editor_config, 'Grid Visible').onChange(function(){
      _this.plane.visible = _this.editor_config["Grid Visible"];
    });
    gridui.add(this.editor_config, 'Grid Position', -1000, 1000).step(10).onChange(function(){
      _this.plane.position.z = _this.editor_config["Grid Position"];
    });
    this.gui.add(this.editor_config, 'Symmetry', { None: 1, Two: 2, Three: 3, Six: 6 });*/
    //gui.close();

    document.getElementById("interface").style.display = 'block';

    // Hide loading label
    this.loading.style.display = 'none';

    this.animate();
  }
  
  this.add_placeholders = function () {
    // Adding spaceship placeholders
    this.main_frames = new THREE.Object3D();
    this.scene.add(this.main_frames);

    this.sec_frames = new THREE.Object3D();
    this.scene.add(this.sec_frames);

    this.modules = new THREE.Object3D();
    this.scene.add(this.modules);

    this.shilds = new THREE.Object3D();
    this.scene.add(this.shilds);

    this.shild_frames = new THREE.Object3D();
    this.scene.add(this.shild_frames);

    this.rollovers = new THREE.Object3D();
    this.scene.add(this.rollovers);
  }

  this.clear = function() {

//alert("clear+ "+ library.list);
    this.set_prev_context(); //+++

    // Recreating WebGL scene
    this.scene.remove(this.main_frames);
    this.main_frames = new THREE.Object3D();
    this.scene.add(this.main_frames);
    
    this.scene.remove(this.sec_frames);
    this.sec_frames = new THREE.Object3D();
    this.scene.add(this.sec_frames);
    
    this.scene.remove(this.modules);
    this.modules = new THREE.Object3D();
    this.scene.add(this.modules);
    
    this.scene.remove(this.shilds);
    this.shilds = new THREE.Object3D();
    this.scene.add(this.shilds);
    
    this.scene.remove(this.shild_frames);
    this.shild_frames = new THREE.Object3D();
    this.scene.add(this.shild_frames);

//    this.scene.remove(this.rollovers); //!!! ???
//    this.rollovers = new THREE.Object3D();
//    this.scene.add(this.rollovers);

    // Recreating ship
//??? correct use
    this.ship = {
      "modules": {},
      "frame_main": {},
      "frame_sec": {},
      "shilds":{}
    }
/*    this.ship = {
      "modules": [],
      "frame_main": [],
      "frame_sec": [],
      "shilds":[]
    }*/
    this.set_ref_plane();
  }
  
  this.ship2json = function() {
    var ship_store = {
      "version":3, //+++ rot +++ sca "version":2,
      "library":library.list, //+++ lib
      "modules":{},
      "frame_main":{},
      "frame_sec":{},
      "shilds":[]
    }
    if (library.list.length == 0) delete ship_store.library;  //+++ lib
    // Save modules. Sort by name
    for_each(this.ship.modules, function(i, mod) {
      if (ship_store.modules[mod.mod] == undefined) {
        ship_store.modules[mod.mod] = [];
      }
      var a = angle_Z_by_index(mod.index);  //--- if (!a) a = 0;
      var r = mod.posrota; //+++ rot
      var s = Math.round(mod.scale.z * 100)/100; // *100 //+++ sca
      var p = mod.position.clone(); 
      
      p = to_hex_100(p); //+++  // *100
      ship_store.modules[mod.mod].push([p.x, p.y, p.z, a, r, s]);  // *100 //+++ sca //+++ rot
///      var p =  mod.index.split(";");
///      ship_store.modules[mod.mod].push([p[1]/100, p[2]/100, p[3]/100, a, r, s]);  //+++ sca //+++ rot // *100

    });
    
    // Save main frames
    var saved_frames = {};
    for_each(this.ship.frame_main, function(i, frame) {
      var mod = frame.mod;
      if (ship_store.frame_main[mod] == undefined) {
        ship_store.frame_main[mod] = [];
      }
      if (saved_frames[i] == undefined) {
        var pos = to_hex_half(frame.position); //+++ step = 15/2
        saved_frames[main_frame_zindex(pos.x, pos.y, pos.z)] = true;
        
        // searching beginning of frame
        var pos1 = pos.z;
        while ((_this.ship.frame_main[main_frame_zindex(pos.x, pos.y, pos1 - 1)] != undefined) &&
               (_this.ship.frame_main[main_frame_zindex(pos.x, pos.y, pos1 - 1)].mod == mod)) {
          --pos1;
          saved_frames[main_frame_zindex(pos.x, pos.y, pos1)] = true;
        }
        // searching end of frame
        var pos2 = pos.z;
        while ((_this.ship.frame_main[main_frame_zindex(pos.x, pos.y, pos2 + 1)] != undefined) &&
               (_this.ship.frame_main[main_frame_zindex(pos.x, pos.y, pos2 + 1)].mod == mod)) {
          ++pos2;
          saved_frames[main_frame_zindex(pos.x, pos.y, pos2)] = true;
        }
        
        ship_store.frame_main[mod].push([pos.x, pos.y, pos1, pos2 - pos1 + 1]);
      }
    });
    
    // Save secondary frames
    for_each(this.ship.frame_sec, function(i, frame) {
//!!! sec
      var arr = i.split(";");
      var arr_int = [];
      var mod = frame[0].mod;
      for_each(arr, function(i, item) {
//!!!
//        arr_int.push(parseInt(item,10));
        arr_int.push(parseFloat(item)/100); // *100
      });
      arr_int.push(frame[0].circle); 	//arr_int.push(p[7]);	//+++ circ //+++ rot 
      if (ship_store.frame_sec[mod] == undefined) {
        ship_store.frame_sec[mod] = [];
      }
      ship_store.frame_sec[mod].push(arr_int);
    });
    
    // Save shilds
    for_each(this.ship.shilds, function(i, layer) {
      var shilds = {};
      var empty = true;
      for_each(layer.plates, function(j, plate) {
        //var tri_pos = to_tri(plate.position);
        var mod = plate.mod;
        if (shilds[mod] == undefined) {
          shilds[mod] = [];
        }
        empty = false;
        shilds[mod].push([plate.tri_pos.x, plate.tri_pos.y]);
      });
      if (!empty) {
        ship_store.shilds.push({
          "layer":parseInt(i),
          "curve":layer.curve,
          "line":layer.line,
          "radius":layer.radius,
          "circular": layer.circular,
          "flip": layer.flip,
          "plates":shilds
        });
      }
    });
    
    return JSON.stringify(ship_store);
  }

  this.json2ship = function (ship_store){
    if (ship_store.version == 3) {

      // Restore modules v3
      for_each(ship_store.modules, function(mod_name, positions) {
        if (modules[mod_name] == undefined) { 	// || (modules[mod_name] == null)
          window.alert("Module \"" + mod_name + "\" removed,\n no loaded from json (ver.3)");
          return;
	}

        if (modules[mod_name].remodule) {
          window.alert("\"" + modules[mod_name].name + "\"\n module replaced on \n"+modules[mod_name].remodule);
		mod_name = modules[mod_name].remodule;
	     }

        for_each(positions, function(i, p) {
	  if ((p[5] == undefined) || (modules[mod_name].varsize == undefined)) {
	     p[5] = 1; 
	  }
	  else if (! chek_arr(modules[mod_name].varsize, function(i, vol){if (vol == p[5]) return i; else return undefined;})) {
	     p[5] = 1 ;
             window.alert("\"" + modules[mod_name].name + "\"\n module size corrected");
	  }
          _this.add_module(mod_name, {x:p[0], y:p[1], z:p[2]}, p[3], p[4], p[5]);
		//((p[5] == undefined) || (modules[mod_name].varsize == undefined)) ? 1 : p[5]); //+++ sca //+++ rot
										//--- ? 1 : modules[mod_name].varsize[p[5]]
        });
      });

    } else { //ship_store.version < 3

      // Restore modules
      for_each(ship_store.modules, function(mod_name, positions) {
        if (modules[mod_name] == undefined) { // || (modules[mod_name] == null)
          window.alert("Module \"" + mod_name + "\"removed,\n no loaded from json (ver.2)");
          return;
	}

        if (modules[mod_name].remodule) {
          window.alert("\"" + modules[mod_name].name + "\"\n module replaced on \n"+modules[mod_name].remodule);
		mod_name = modules[mod_name].remodule;
	     }

        for_each(positions, function(i, p) {
          _this.add_module(mod_name, {x:p[0], y:p[1], z:p[2]}, angle_to_hex(angle_from_hex(p[3]))); //+++ check errors -angleZ //+++ step = 15/2 
        })
      });
    }
    if (ship_store.version == 1) {
      // Restore main frames
      for_each(ship_store.frame_main, function(i, p) {
        _this.add_main_frame(p[0], p[1], p[2], p[3], "main_frame_base");
      });
      
      // Restore secondary frames
      for_each(ship_store.frame_sec, function(i, p) {
        _this.add_sec_frame(
          {x:p[0], y:p[1], z:p[2]},
          {x:p[3], y:p[4], z:p[5]},
          "sec_frame_base"
        );
      });
      
      // Restore shilds
      for_each(ship_store.shilds, function(i, a_layer) {
        _this.ship.shilds[a_layer.layer] = {
          curve : a_layer.curve,
          line : a_layer.line,
          radius : a_layer.radius,
          circular: false,
          flip: false,
          plates : [],
          frames : []
        }
        for_each(a_layer.plates, function(j, p) {
          _this.add_shild({x:p[0], y:p[1], z:a_layer.layer}, "shield_base");
        });
      });
    } else if (ship_store.version >= 2) { //+++ rot

      // Restore main frames
      for_each(ship_store.frame_main, function(mod_name, positions) {
       for_each(positions, function(i, p) {
          _this.add_main_frame(p[0], p[1], p[2], p[3], mod_name); //+++ step = 15/2
        })
      });
      // Restore secondary frames
      for_each(ship_store.frame_sec, function(mod_name, positions) {
        for_each(positions, function(i, p) {
          _this.add_sec_frame(
            {x:p[0], y:p[1], z:p[2]},
            {x:p[3], y:p[4], z:p[5]},
            mod_name, p[6]	//, p[7]	//+++ circ //+++ rot 
          );
        })
      });
      
      // Restore shilds
      for_each(ship_store.shilds, function(i, a_layer) {
        _this.ship.shilds[a_layer.layer] = {
          curve : a_layer.curve,
          line : a_layer.line !== undefined ? a_layer.line : 0,
          radius : a_layer.radius,
          circular: a_layer.circular !== undefined ? a_layer.circular : false,
          flip: a_layer.flip !== undefined ? a_layer.flip : (a_layer.curve < 0),
          plates : [],
          frames : []
        }
        for_each(a_layer.plates, function(mod_name, positions) {
          for_each(positions, function(j, p) {
            _this.add_shild({x:p[0], y:p[1], z:a_layer.layer}, mod_name);
          })
        });
      });

    }
    _this.set_ref_plane();
	}

  this.generate_sm_multy_conv = function () {// generate_sm_multy_conv
    /*this.models_loader.model("shild_frame");
    var groups = ["default", "radiators", "engines", "habbitat"];*/
    var groups = ["body", "engines", "habitat", "ht_radiators", "hyperdrive", "lt_radiators"];

    var sub_meshes = {};
    for_each(groups, function (i, group) {
      sub_meshes[group] = {
        nv: 0,
        ni: 0,
        v_array: [],
        i_array: [],
        mat: i
      }
    });
    /*var nv = 0;
    var ni = 0;*/
    /*var v_array = new Array();
    var i_array = new Array();*/

    var min_point = new THREE.Vector3(1000, 1000, 1000);
    var max_point = new THREE.Vector3(-1000, -1000, -1000);
    var r = 0;

    // First run search bbox and nv, ni
    //var ship_objects = [this.main_frames, this.sec_frames, this.modules, this.shilds, this.shild_frames];
    //var sub_mesh_names = ["default", "default", "", "default", "default"];

    for_each(groups, function (i, group) {
      var geom = _this.models_loader.model(group);
      var m = new THREE.Matrix4();

      var sub_mesh = sub_meshes[group];
      /*if (sub_obj == _this.modules) {
        if (modules[obj.mod].category !== undefined) {
          sub_mesh = sub_meshes[modules[obj.mod].category];
        }
      }*/

      /*for_each(geom.vertices, function (v, vert) {
      v = parseInt(v,10);
      var v_trans = m.multiplyVector3(vert.clone());
      v_array[nv + v] = { "pos": v_trans };

      min_point.x = Math.min(v_trans.x, min_point.x);
      min_point.y = Math.min(v_trans.y, min_point.y);
      min_point.z = Math.min(v_trans.z, min_point.z);

      max_point.x = Math.max(v_trans.x, max_point.x);
      max_point.y = Math.max(v_trans.y, max_point.y);
      max_point.z = Math.max(v_trans.z, max_point.z);
      });*/

      /*var filter_zp = false;
      var filter_zn = false;
      if (sub_obj == _this.main_frames) {
        var hex_pos = to_hex(obj.position);
        filter_zp = _this.ship.frame_main[main_frame_zindex(hex_pos.x, hex_pos.y, hex_pos.z + 1)] != undefined;
        filter_zn = _this.ship.frame_main[main_frame_zindex(hex_pos.x, hex_pos.y, hex_pos.z - 1)] != undefined;
      }*/

      var reindex = [];

      for_each(geom.faces, function (f, face) {
        f = parseInt(f,10);
        var uv = geom.faceVertexUvs[0][f];

        function handle_vertex(a_ind, a_face_ind) {
          // new index
          if (reindex[a_ind] == undefined) {
            var v_trans = m.multiplyVector3(geom.vertices[a_ind].clone());
            //v_array[nv + v] = { "pos": v_trans };

            min_point.x = Math.min(v_trans.x, min_point.x);
            min_point.y = Math.min(v_trans.y, min_point.y);
            min_point.z = Math.min(v_trans.z, min_point.z);

            max_point.x = Math.max(v_trans.x, max_point.x);
            max_point.y = Math.max(v_trans.y, max_point.y);
            max_point.z = Math.max(v_trans.z, max_point.z);

            reindex[a_ind] = sub_mesh.v_array.length;
            sub_mesh.v_array.push({
              pos: v_trans,
              uv: uv[a_face_ind],
              n: m.rotateAxis(face.vertexNormals[a_face_ind].clone()),
              t: m.rotateAxis(face.vertexTangents[a_face_ind].clone())
            });
          }

          sub_mesh.i_array.push(reindex[a_ind]);
        }
        /*v_array[face.a + nv].uv = uv[0];
        v_array[face.a + nv].n = m.rotateAxis(face.vertexNormals[0].clone());
        v_array[face.a + nv].t = m.rotateAxis(face.vertexTangents[0].clone());

        v_array[face.b + nv].uv = uv[1];
        v_array[face.b + nv].n = m.rotateAxis(face.vertexNormals[1].clone());
        v_array[face.b + nv].t = m.rotateAxis(face.vertexTangents[1].clone());

        v_array[face.c + nv].uv = uv[2];
        v_array[face.c + nv].n = m.rotateAxis(face.vertexNormals[2].clone());
        v_array[face.c + nv].t = m.rotateAxis(face.vertexTangents[2].clone());*/

        /*if (!((filter_zp && face.normal.z > 0) ||
              (filter_zn && face.normal.z < 0))) */{
          handle_vertex(face.a, 0);
          handle_vertex(face.b, 1);
          handle_vertex(face.c, 2);
        }
        /*var v1 = [get_v(geom.vertices[face.a]), get_t(uv[0]), get_n(face.vertexNormals[0])];
        var v2 = [get_v(geom.vertices[face.b]), get_t(uv[1]), get_n(face.vertexNormals[1])];
        var v3 = [get_v(geom.vertices[face.c]), get_t(uv[2]), get_n(face.vertexNormals[2])];*/
      });

      //nv += geom.vertices.length;
      //ni += geom.faces.length * 3;
    });

    var sum_nv = 0;
    var sum_ni = 0;
    var n_meshes = 0;

    for_each(sub_meshes, function (i, sub_mesh) {
      sub_mesh.nv = sub_mesh.v_array.length;
      sub_mesh.ni = sub_mesh.i_array.length;
      if (sub_mesh.v_array.length > 0) {
        sum_nv += sub_mesh.nv;
        sum_ni += sub_mesh.ni;
        n_meshes++;
      }
    });

    var v_size = 12;
    var vp_offset = 0;
    var vn_offset = 3;
    var vt_offset = 6;
    var vuv_offset = 10;
    var header_size = 1 + 1 + 4; // + 1 + 2; 
    // signature + num_blocks + center(3)/radius
    var block_head_size = 1 + 1 + 1;
    // mat_ind + num_vertexes + num_indexes

    var file_size = (header_size + block_head_size * n_meshes + sum_nv * v_size + sum_ni) * 4;
    var data_buffer = /*a_fs ? new Buffer(file_size) :*/new ArrayBuffer(file_size);
    //var header_buffer = new Uint32Array(3);

    // Integer part of header
    var header_buffer = new Uint32Array(data_buffer, 0, header_size);
    header_buffer[0] = 0x31304D53 // Signature "SM01"
    header_buffer[1] = n_meshes; // Blocks count
    /*header_buffer[6] = nv; 
    header_buffer[7] = ni;
    header_buffer[8] = 0; // Material index*/

    var center = new THREE.Vector3();
    center.add(max_point, min_point);
    center.multiplyScalar(0.5);
    max_point.subSelf(center);
    var r = max_point.length();

    // Float part o header
    var header_buffer_f = new Float32Array(data_buffer, 0, header_size);
    header_buffer_f[2] = center.x;
    header_buffer_f[3] = center.y;
    header_buffer_f[4] = center.z;
    header_buffer_f[5] = r;

    var cur_offset = header_size;

    for_each(sub_meshes, function (i, sub_mesh) {
      if (sub_mesh.nv > 0) {
        // Block head
        var block_header_buffer = new Uint32Array(data_buffer, cur_offset * 4, block_head_size);
        block_header_buffer[0] = sub_mesh.nv;
        block_header_buffer[1] = sub_mesh.ni;
        block_header_buffer[2] = sub_mesh.mat;

        var v_buffer = new Float32Array(data_buffer, (cur_offset + block_head_size) * 4, sub_mesh.nv * v_size);
        //var v_buffer = new Float32Array(nv * v_size + v_offset);
        //v_buffer = new Float32Array(ni * v_size + v_offset);
        var i_buffer = new Uint32Array(data_buffer, (cur_offset + block_head_size + sub_mesh.nv * v_size) * 4, sub_mesh.ni);
        //var i_buffer = new Uint32Array(ni);

        for_each(sub_mesh.v_array, function (v, vert) {
          v_buffer[v * v_size + vp_offset] = vert.pos.x;
          v_buffer[v * v_size + vp_offset + 1] = vert.pos.y;
          v_buffer[v * v_size + vp_offset + 2] = vert.pos.z;

          v_buffer[v * v_size + vn_offset] = vert.n.x;
          v_buffer[v * v_size + vn_offset + 1] = vert.n.y;
          v_buffer[v * v_size + vn_offset + 2] = vert.n.z;

          v_buffer[v * v_size + vt_offset] = vert.t.x;
          v_buffer[v * v_size + vt_offset + 1] = vert.t.y;
          v_buffer[v * v_size + vt_offset + 2] = vert.t.z;
          v_buffer[v * v_size + vt_offset + 3] = -vert.t.w; // invert binormal

          v_buffer[v * v_size + vuv_offset] = vert.uv.u;
          v_buffer[v * v_size + vuv_offset + 1] = vert.uv.v;
        });

        for_each(sub_mesh.i_array, function (i, ind) {
          i_buffer[i] = ind;
        });

        cur_offset += block_head_size + sub_mesh.nv * v_size + sub_mesh.ni;
      }
    });

    /*var bb = new BlobBuilder;
    bb.append(header_buffer);
    bb.append(v_buffer);
    bb.append(i_buffer);*/
    return data_buffer; //new Blob([header_buffer, v_buffer, i_buffer], { type: "application/octet-stream" });
    //return bb.getBlob("application/octet-stream");
  }

  this.generate_sm = function () { //generate_sm_multy
    var groups = ["default", "diamond", "silver", "gold", "empty_frames", "radiators", "engines", "habbitat", "hyper_ring", "hyper_ring_thick"];

    var sub_meshes = {};
    for_each(groups, function(i, group) {
      sub_meshes[group] = {
        nv : 0,
        ni : 0,
        v_array : [],
        i_array : [],
        mat: i
      }
    });
    /*var nv = 0;
    var ni = 0;*/
    /*var v_array = new Array();
    var i_array = new Array();*/

    var min_point = new THREE.Vector3(1000, 1000, 1000);
    var max_point = new THREE.Vector3(-1000, -1000, -1000);
    var r = 0;
    
    // First run search bbox and nv, ni
    var ship_objects = [this.main_frames, this.sec_frames, this.modules, this.shilds, this.shild_frames];
    //var sub_mesh_names = ["default", "default", "", "default", "default"];
    for_each(ship_objects, function (i, sub_obj) {
      for_each(sub_obj.children, function (j, obj) {
        var geom = obj.geometry;
        var m = obj.matrix;

        var sub_mesh = sub_meshes["default"];
        if (sub_obj == _this.modules) {
          if (modules[obj.mod].category !== undefined) {
            sub_mesh = sub_meshes[modules[obj.mod].category];
          }
        } else {
          if (obj.mat.name != "default") {
            sub_mesh = sub_meshes[obj.mat.name];
          }
        }

        /*for_each(geom.vertices, function (v, vert) {
          v = parseInt(v,10);
          var v_trans = m.multiplyVector3(vert.clone());
          v_array[nv + v] = { "pos": v_trans };

          min_point.x = Math.min(v_trans.x, min_point.x);
          min_point.y = Math.min(v_trans.y, min_point.y);
          min_point.z = Math.min(v_trans.z, min_point.z);

          max_point.x = Math.max(v_trans.x, max_point.x);
          max_point.y = Math.max(v_trans.y, max_point.y);
          max_point.z = Math.max(v_trans.z, max_point.z);
        });*/

        var filter_zp = false;
        var filter_zn = false;
        if (sub_obj == _this.main_frames) {
          var hex_pos = to_hex(obj.position); //??? step = 15/2
          var p_frame = _this.ship.frame_main[main_frame_zindex(hex_pos.x, hex_pos.y, hex_pos.z + 1)];
          filter_zp = p_frame != undefined && !(obj.mat.name == "default" && p_frame.mat.name == "empty_frames");
          var n_frame = _this.ship.frame_main[main_frame_zindex(hex_pos.x, hex_pos.y, hex_pos.z - 1)];
          filter_zn = n_frame != undefined && !(obj.mat.name == "default" && n_frame.mat.name == "empty_frames");
        }
        
        var reindex = [];

        for_each(geom.faces, function (f, face) {
          f = parseInt(f,10);
          var uv = geom.faceVertexUvs[0][f];

          function handle_vertex(a_ind, a_face_ind) {
            // new index
            if (reindex[a_ind] == undefined) {
              var v_trans = m.multiplyVector3(geom.vertices[a_ind].clone());
              //v_array[nv + v] = { "pos": v_trans };

              min_point.x = Math.min(v_trans.x, min_point.x);
              min_point.y = Math.min(v_trans.y, min_point.y);
              min_point.z = Math.min(v_trans.z, min_point.z);

              max_point.x = Math.max(v_trans.x, max_point.x);
              max_point.y = Math.max(v_trans.y, max_point.y);
              max_point.z = Math.max(v_trans.z, max_point.z);

              reindex[a_ind] = sub_mesh.v_array.length;
              sub_mesh.v_array.push({
                pos: v_trans,
                uv: uv[a_face_ind],
                n: m.rotateAxis(face.vertexNormals[a_face_ind].clone()),
                t: m.rotateAxis(face.vertexTangents[a_face_ind].clone())
              });
            }
            
            sub_mesh.i_array.push(reindex[a_ind]);
          }
          /*v_array[face.a + nv].uv = uv[0];
          v_array[face.a + nv].n = m.rotateAxis(face.vertexNormals[0].clone());
          v_array[face.a + nv].t = m.rotateAxis(face.vertexTangents[0].clone());

          v_array[face.b + nv].uv = uv[1];
          v_array[face.b + nv].n = m.rotateAxis(face.vertexNormals[1].clone());
          v_array[face.b + nv].t = m.rotateAxis(face.vertexTangents[1].clone());

          v_array[face.c + nv].uv = uv[2];
          v_array[face.c + nv].n = m.rotateAxis(face.vertexNormals[2].clone());
          v_array[face.c + nv].t = m.rotateAxis(face.vertexTangents[2].clone());*/

          /*if (!((filter_zp && face.normal.z > 0) ||
                (filter_zn && face.normal.z < 0))) {*/
          if (!((filter_zp && face.normal.z != 0 && geom.vertices[face.a].z > 0) ||
                (filter_zn && face.normal.z != 0 && geom.vertices[face.a].z < 0))) {
            handle_vertex(face.a, 0);
            handle_vertex(face.b, 1);
            handle_vertex(face.c, 2);
            /*i_array.push(face.a + nv);
            i_array.push(face.b + nv);
            i_array.push(face.c + nv);*/
          }
          /*var v1 = [get_v(geom.vertices[face.a]), get_t(uv[0]), get_n(face.vertexNormals[0])];
          var v2 = [get_v(geom.vertices[face.b]), get_t(uv[1]), get_n(face.vertexNormals[1])];
          var v3 = [get_v(geom.vertices[face.c]), get_t(uv[2]), get_n(face.vertexNormals[2])];*/
        });

        //nv += geom.vertices.length;
        //ni += geom.faces.length * 3;
      });
    });

    var sum_nv = 0;
    var sum_ni = 0;
    var n_meshes = 0;

    for_each(sub_meshes, function(i, sub_mesh) {
      sub_mesh.nv = sub_mesh.v_array.length;
      sub_mesh.ni = sub_mesh.i_array.length;
      if (sub_mesh.v_array.length > 0) {
        sum_nv += sub_mesh.nv;
        sum_ni += sub_mesh.ni;
        n_meshes++;
      }
    });

    var v_size = 12;
    var vp_offset = 0;
    var vn_offset = 3;
    var vt_offset = 6;
    var vuv_offset = 10;
    var header_size = 1 + 1 + 4;// + 1 + 2; 
    // signature + num_blocks + center(3)/radius
    var block_head_size = 1 + 1 + 1;
    // mat_ind + num_vertexes + num_indexes

    var file_size = (header_size + block_head_size * n_meshes + sum_nv * v_size + sum_ni) * 4;
    var data_buffer = /*a_fs ? new Buffer(file_size) :*/ new ArrayBuffer(file_size);
    //var header_buffer = new Uint32Array(3);

    // Integer part of header
    var header_buffer = new Uint32Array(data_buffer, 0, header_size);
    header_buffer[0] = 0x31304D53 // Signature "SM01"
    header_buffer[1] = n_meshes; // Blocks count
    /*header_buffer[6] = nv; 
    header_buffer[7] = ni;
    header_buffer[8] = 0; // Material index*/

    var center = new THREE.Vector3();
    center.add(max_point, min_point);
    center.multiplyScalar(0.5);
    max_point.subSelf(center);
    var r = max_point.length();

    // Float part o header
    var header_buffer_f = new Float32Array(data_buffer, 0, header_size);
    header_buffer_f[2] = center.x;
    header_buffer_f[3] = center.y;
    header_buffer_f[4] = center.z;
    header_buffer_f[5] = r;
    
    var cur_offset = header_size;
    
    for_each(sub_meshes, function(i, sub_mesh) {
      if (sub_mesh.nv > 0) {
        // Block head
        var block_header_buffer = new Uint32Array(data_buffer, cur_offset * 4, block_head_size);
        block_header_buffer[0] = sub_mesh.nv;
        block_header_buffer[1] = sub_mesh.ni;
        block_header_buffer[2] = sub_mesh.mat;
      
        var v_buffer = new Float32Array(data_buffer, (cur_offset +  block_head_size)* 4, sub_mesh.nv * v_size);
        //var v_buffer = new Float32Array(nv * v_size + v_offset);
        //v_buffer = new Float32Array(ni * v_size + v_offset);
        var i_buffer = new Uint32Array(data_buffer, (cur_offset + block_head_size + sub_mesh.nv * v_size) * 4, sub_mesh.ni);
        //var i_buffer = new Uint32Array(ni);

        for_each(sub_mesh.v_array, function (v, vert) {
          v_buffer[v * v_size + vp_offset] = vert.pos.x;
          v_buffer[v * v_size + vp_offset + 1] = vert.pos.y;
          v_buffer[v * v_size + vp_offset + 2] = vert.pos.z;

          v_buffer[v * v_size + vn_offset] = vert.n.x;
          v_buffer[v * v_size + vn_offset + 1] = vert.n.y;
          v_buffer[v * v_size + vn_offset + 2] = vert.n.z;

          v_buffer[v * v_size + vt_offset] = vert.t.x;
          v_buffer[v * v_size + vt_offset + 1] = vert.t.y;
          v_buffer[v * v_size + vt_offset + 2] = vert.t.z;
          v_buffer[v * v_size + vt_offset + 3] = -vert.t.w; // invert binormal

          v_buffer[v * v_size + vuv_offset] = vert.uv.u;
          v_buffer[v * v_size + vuv_offset + 1] = vert.uv.v;
        });

        for_each(sub_mesh.i_array, function (i, ind) {
          i_buffer[i] = ind;
        });
        
        cur_offset += block_head_size + sub_mesh.nv * v_size + sub_mesh.ni;
      }
    });

    /*var bb = new BlobBuilder;
    bb.append(header_buffer);
    bb.append(v_buffer);
    bb.append(i_buffer);*/
    return data_buffer;//new Blob([header_buffer, v_buffer, i_buffer], { type: "application/octet-stream" });
    //return bb.getBlob("application/octet-stream");
  }

  this.generate_sm_single = function () { //generate_sm_single
    var nv = 0;
    var ni = 0;
    var min_point = new THREE.Vector3(1000, 1000, 1000);
    var max_point = new THREE.Vector3(-1000, -1000, -1000);
    var r = 0;

    var v_array = new Array();
    var i_array = new Array();
    // First run search bbox and nv, ni
    var ship_objects = [this.main_frames, this.sec_frames, this.modules, this.shilds, this.shild_frames];
    for_each(ship_objects, function (i, sub_obj) {
      for_each(sub_obj.children, function (j, obj) {
        var geom = obj.geometry;
        var m = obj.matrix;

        /*for_each(geom.vertices, function (v, vert) {
          v = parseInt(v,10);
          var v_trans = m.multiplyVector3(vert.clone());
          v_array[nv + v] = { "pos": v_trans };

          min_point.x = Math.min(v_trans.x, min_point.x);
          min_point.y = Math.min(v_trans.y, min_point.y);
          min_point.z = Math.min(v_trans.z, min_point.z);

          max_point.x = Math.max(v_trans.x, max_point.x);
          max_point.y = Math.max(v_trans.y, max_point.y);
          max_point.z = Math.max(v_trans.z, max_point.z);
        });*/

        var filter_zp = false;
        var filter_zn = false;
        if (sub_obj == _this.main_frames) {
          var hex_pos = to_hex(obj.position); //??? step = 15/2
          filter_zp = _this.ship.frame_main[main_frame_zindex(hex_pos.x, hex_pos.y, hex_pos.z + 1)] != undefined;
          filter_zn = _this.ship.frame_main[main_frame_zindex(hex_pos.x, hex_pos.y, hex_pos.z - 1)] != undefined;
        }
        
        var reindex = [];

        for_each(geom.faces, function (f, face) {
          f = parseInt(f,10);
          var uv = geom.faceVertexUvs[0][f];

          function handle_vertex(a_ind, a_face_ind) {
            // new index
            if (reindex[a_ind] == undefined) {
              var v_trans = m.multiplyVector3(geom.vertices[a_ind].clone());
              //v_array[nv + v] = { "pos": v_trans };

              min_point.x = Math.min(v_trans.x, min_point.x);
              min_point.y = Math.min(v_trans.y, min_point.y);
              min_point.z = Math.min(v_trans.z, min_point.z);

              max_point.x = Math.max(v_trans.x, max_point.x);
              max_point.y = Math.max(v_trans.y, max_point.y);
              max_point.z = Math.max(v_trans.z, max_point.z);

              reindex[a_ind] = v_array.length;
              v_array.push({
                pos: v_trans,
                uv: uv[a_face_ind],
                n: m.rotateAxis(face.vertexNormals[a_face_ind].clone()),
                t: m.rotateAxis(face.vertexTangents[a_face_ind].clone())
              });
            }
            
            i_array.push(reindex[a_ind]);
          }
          /*v_array[face.a + nv].uv = uv[0];
          v_array[face.a + nv].n = m.rotateAxis(face.vertexNormals[0].clone());
          v_array[face.a + nv].t = m.rotateAxis(face.vertexTangents[0].clone());

          v_array[face.b + nv].uv = uv[1];
          v_array[face.b + nv].n = m.rotateAxis(face.vertexNormals[1].clone());
          v_array[face.b + nv].t = m.rotateAxis(face.vertexTangents[1].clone());

          v_array[face.c + nv].uv = uv[2];
          v_array[face.c + nv].n = m.rotateAxis(face.vertexNormals[2].clone());
          v_array[face.c + nv].t = m.rotateAxis(face.vertexTangents[2].clone());*/

          if (!((filter_zp && face.normal.z > 0) ||
                (filter_zn && face.normal.z < 0))) {
            handle_vertex(face.a, 0);
            handle_vertex(face.b, 1);
            handle_vertex(face.c, 2);
            /*i_array.push(face.a + nv);
            i_array.push(face.b + nv);
            i_array.push(face.c + nv);*/
          }
          /*var v1 = [get_v(geom.vertices[face.a]), get_t(uv[0]), get_n(face.vertexNormals[0])];
          var v2 = [get_v(geom.vertices[face.b]), get_t(uv[1]), get_n(face.vertexNormals[1])];
          var v3 = [get_v(geom.vertices[face.c]), get_t(uv[2]), get_n(face.vertexNormals[2])];*/
        });

        //nv += geom.vertices.length;
        //ni += geom.faces.length * 3;
      });
    });

    nv = v_array.length;
    ni = i_array.length;

    var v_size = 12;
    var v_offset = 0;
    var vp_offset = 0;
    var vn_offset = 3;
    var vt_offset = 6;
    var vuv_offset = 10;
    var header_size = 1 + 1 + 4 + 1 + 2; 
    // signature + num_blocks + center(3)/radius + (block_head = mat_ind + num_vertexes + num_indexes)

    var file_size = (header_size + nv * v_size + v_offset + ni) * 4;
    var data_buffer = /*a_fs ? new Buffer(file_size) :*/ new ArrayBuffer(file_size);
    //var header_buffer = new Uint32Array(3);

    // Integer part of header
    var header_buffer = new Uint32Array(data_buffer, 0, header_size);
    header_buffer[0] = 0x31304D53 // Signature "SM00"
    header_buffer[1] = 1; // Blocks count
    header_buffer[6] = nv; 
    header_buffer[7] = ni;
    header_buffer[8] = 0; // Material index

    var center = new THREE.Vector3();
    center.add(max_point, min_point);
    center.multiplyScalar(0.5);
    max_point.subSelf(center);
    var r = max_point.length();

    // Float part o header
    var header_buffer_f = new Float32Array(data_buffer, 0, header_size);
    header_buffer_f[2] = center.x;
    header_buffer_f[3] = center.y;
    header_buffer_f[4] = center.z;
    header_buffer_f[5] = r;

    var v_buffer = new Float32Array(data_buffer, header_size * 4, nv * v_size + v_offset);
    //var v_buffer = new Float32Array(nv * v_size + v_offset);
    //v_buffer = new Float32Array(ni * v_size + v_offset);
    var i_buffer = new Uint32Array(data_buffer, (header_size + nv * v_size + v_offset) * 4, ni);
    //var i_buffer = new Uint32Array(ni);

    for_each(v_array, function (v, vert) {
      v_buffer[v_offset + v * v_size + vp_offset] = vert.pos.x;
      v_buffer[v_offset + v * v_size + vp_offset + 1] = vert.pos.y;
      v_buffer[v_offset + v * v_size + vp_offset + 2] = vert.pos.z;

      v_buffer[v_offset + v * v_size + vn_offset] = vert.n.x;
      v_buffer[v_offset + v * v_size + vn_offset + 1] = vert.n.y;
      v_buffer[v_offset + v * v_size + vn_offset + 2] = vert.n.z;

      v_buffer[v_offset + v * v_size + vt_offset] = vert.t.x;
      v_buffer[v_offset + v * v_size + vt_offset + 1] = vert.t.y;
      v_buffer[v_offset + v * v_size + vt_offset + 2] = vert.t.z;
      v_buffer[v_offset + v * v_size + vt_offset + 3] = -vert.t.w; // invert binormal

      v_buffer[v_offset + v * v_size + vuv_offset] = vert.uv.u;
      v_buffer[v_offset + v * v_size + vuv_offset + 1] = vert.uv.v;
    });

    for_each(i_array, function (i, ind) {
      i_buffer[i] = ind;
    });

    /*var bb = new BlobBuilder;
    bb.append(header_buffer);
    bb.append(v_buffer);
    bb.append(i_buffer);*/
    return data_buffer;//new Blob([header_buffer, v_buffer, i_buffer], { type: "application/octet-stream" });
    //return bb.getBlob("application/octet-stream");
  }

  this.generate_obj = function () {
    var vs = [];
    var v_ind = {};

    var tvs = [];
    var tv_ind = {};

    var nvs = [];
    var nv_ind = {};

    var fs = {};

    var digits = 4; // number of decimal points, eg. 4 for epsilon of 0.0001
    var precision = Math.pow(10, digits);

    function hash_uv(a_uv) {
      return [Math.round(a_uv.u * precision), Math.round(a_uv.v * precision)].join('_');
    }

    function hash_v(a_v) {
      return [Math.round(a_v.x * precision), Math.round(a_v.y * precision), Math.round(a_v.z * precision)].join('_');
    }

	  var collected_v = 0;
    // Coollect all vertexes and faces
    var ship_objects = [this.main_frames, this.sec_frames, this.modules, this.shilds, this.shild_frames];
    for_each(ship_objects, function(i, sub_obj) {
      for_each(sub_obj.children, function(j, obj) {
        var geom = obj.geometry;
        var m = obj.matrix;
        var group_name = obj.mat.name;
        if (fs[group_name] == undefined) {
          fs[group_name] = [];
        }
        var gr = fs[group_name];

        function get_v(v) {
          var v_t = m.multiplyVector3(v.clone());
          var hash = hash_v(v_t);
          var ind = v_ind[hash];
          if (ind == undefined) {
            vs.push(v_t);
            ind = vs.length - 1;
            v_ind[hash] = ind;
          }
          return ind + 1;
        }

        function get_n(n) {
          var n_t = m.rotateAxis(n.clone());
          var hash = hash_v(n_t);
          var ind = nv_ind[hash];
          if (ind == undefined) {
            nvs.push(n_t);
            ind = nvs.length - 1;
            nv_ind[hash] = ind;
          }
          return ind + 1;
        }

        function get_t(t) {
          var hash = hash_uv(t);
          var ind = tv_ind[hash];
          if (ind == undefined) {
            tvs.push(t);
            ind = tvs.length - 1;
            tv_ind[hash] = ind;
          }
          return ind + 1;
        }

        var filter_zp = false;
        var filter_zn = false;
        if (sub_obj == _this.main_frames) {
          var hex_pos = to_hex(obj.position); //??? step = 15/2
          var p_frame = _this.ship.frame_main[main_frame_zindex(hex_pos.x, hex_pos.y, hex_pos.z + 1)];
          filter_zp = p_frame != undefined && !(obj.mat.name == "default" && p_frame.mat.name == "empty_frames");
          var n_frame = _this.ship.frame_main[main_frame_zindex(hex_pos.x, hex_pos.y, hex_pos.z - 1)];
          filter_zn = n_frame != undefined && !(obj.mat.name == "default" && n_frame.mat.name == "empty_frames");
        }

		    function handle_vert(a_ind, a_v, a_t, a_n) {
			    var ind = a_ind + collected_v;
			    vs[ind] = m.multiplyVector3(a_v.clone());
			    nvs[ind] = m.rotateAxis(a_n.clone());
			    tvs[ind] = a_t;
			    return [ind+1, ind+1, ind+1];
		    }
		
        for_each(geom.faces, function(f, face) {
          var uv = geom.faceVertexUvs[0][f];

          if ((filter_zp && face.normal.z != 0 && geom.vertices[face.a].z > 0) ||
              (filter_zn && face.normal.z != 0 && geom.vertices[face.a].z < 0)) {
            return;
          }

          var v1 = [get_v(geom.vertices[face.a]), get_t(uv[0]), get_n(face.vertexNormals[0])];
          var v2 = [get_v(geom.vertices[face.b]), get_t(uv[1]), get_n(face.vertexNormals[1])];
          var v3 = [get_v(geom.vertices[face.c]), get_t(uv[2]), get_n(face.vertexNormals[2])];
		      /*var v1 = handle_vert(face.a, geom.vertices[face.a], uv[0], face.vertexNormals[0]);
		      var v2 = handle_vert(face.b, geom.vertices[face.b], uv[1], face.vertexNormals[1]);
		      var v3 = handle_vert(face.c, geom.vertices[face.c], uv[2], face.vertexNormals[2]);*/

          gr.push([v1, v2, v3]);
        });
		
		collected_v += geom.vertices.length;
      });
    });

    // Write them into the string
    var obj_str = "# Starship editor\n";

    // v  -2.0000 -2.0000 10.0000
    // # 8 vertices
    for_each(vs, function(i, v) {
      obj_str += "v " + v.x.toFixed(digits) +
                 " " + v.y.toFixed(digits) +
                 " " + v.z.toFixed(digits) + "\n";
    });
    obj_str += "# " + vs.length + " vertices\n\n";

    // vn -0.7071 -0.7071 0.0000
    // # 4 vertex normals
    for_each(nvs, function(i, v) {
      obj_str += "vn " + v.x.toFixed(digits) +
                 " " + v.y.toFixed(digits) +
                 " " + v.z.toFixed(digits) + "\n";
    });
    obj_str += "# " + nvs.length + " vertex normals\n\n";

    // vt 0.1312 0.1187 1.0000
    // # 6 texture coords
    for_each(tvs, function(i, v) {
      obj_str += "vt " + v.u.toFixed(digits) +
                 " " + (1 - v.v).toFixed(digits) + "\n";
    });
    obj_str += "# " + tvs.length + " texture coords\n\n";

    // g group_name
    for_each(fs, function(gr_name, gr) {
      obj_str += "g " + gr_name + "\n";
      // f 4/6/1 8/3/4 7/2/4   // v/vt/vn
      // # 8 faces
      for_each(gr, function(i, f) {
        var face = "f";
        for_each(f, function(j, v) {
          face += " " + v[0] + "/" + v[1] + "/" + v[2];
        });
        obj_str += face + "\n";
      });
      obj_str += "# " + gr.length + " faces\n\n";
    });

    return obj_str;
  }

  this.generate_ship_confg = function (a_name) { // generate_ship_confg
    var ship = {};
    var res_str = "Length   0\n" +
                  "Offset  (0 0 0)\n" +
                  "Albedo   0.3\n" +
                  "Exposure 2\n" +
                  "Color   (1 1 1)\n";

    // Collect all matrices
    var ship_objects = [
      {arr: this.modules, desc: modules}, 
      {arr: this.main_frames, /*config: "frame6",*/ name: "Frame", desc: main_frames},
      {arr: this.sec_frames, /*config: "frame4",*/ name: "SecFrame", desc: sec_frames},
      {arr: this.shilds, /*config: "shild_plate",*/ name: "Shield", desc: shields},
      {arr: this.shild_frames, config: "shield_frame", name: "ShieldFrame"}
    ];

    var r_m = new THREE.Matrix4();
    r_m.identity();
    r_m.elements[0] = -1;
    r_m.elements[10] = -1;

//    var hyper = 0;
    var hyper_r = 0;
    var mass = 0;
    var MainEngines = 0;
    var RetroEngines = 0;
    var CorrEngines = 0;
    for_each(ship_objects, function(i, sub_obj) {
      for_each(sub_obj.arr.children, function(j, obj) {
        var name = sub_obj.name;
        if (name == undefined) {
          name = obj.mod;
        }
        var config = sub_obj.config;
        if (config == undefined) {
          config = obj.mod;
        }
        
        if (ship[name] == undefined) {
          ship[name] = 1;
        }
/*
// hyper_drive
        if (name.indexOf("hyper_drive") == 0) {
          hyper =1;
        }
// hyper_rings
        if (name.indexOf("hyper_ring") == 0) {
	  if (name.indexOf("hyper_ring_thick") == 0) {
            hyper_r +=8;
	  } else {
            hyper_r +=4;
	  }
        }*/

        if (sub_obj.desc != undefined) {
          var desc = sub_obj.desc[config]; 
          var name_lib = desc.lib_name; //+++ lib
          mass += desc.mass;
          if (desc.MainEngines != undefined) {
            MainEngines += desc.MainEngines;
          }
          if (desc.RetroEngines != undefined) {
            RetroEngines += desc.RetroEngines;
          }
          if (desc.CorrEngines != undefined) {
            CorrEngines += desc.CorrEngines;
          }
          if (desc.HyperEngine != undefined) {
            hyper_r += desc.HyperEngine;
          }
//---Thruster
//---          if (desc.ThrustEngines !== undefined) {
//---            CorrEngines += desc.ThrustEngines*4;
//---          }
//---Thruster
        } else {
          var name_lib = "modules";
        }


        var m = new THREE.Matrix4();
        m.multiply(r_m, obj.matrix);
        var m_flat = [];
        m.flattenToArray(m_flat);

        //  Module  "Engine"    { "Test/linear_nf_engine.cfg"        ( 1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1 ) } 
        var str_m = "";
        for_each(m_flat, function (k, m_f) {
          if (k > 0) {
//            str_m += ",";
            str_m += " ";
          }
          str_m += Math.abs(m_f) < 1.0e-6 ? 0 : m_f;
        });

        res_str += "Module  \"" + name + ship[name] + "\" { \""+name_lib+"/" + config + ".cfg\" ( " + str_m + " ) } \n";

//!!! generate start-end frames
        if (sub_obj.arr == _this.main_frames) {
          var hex_pos = to_hex_half(obj.position); //+++ step = 15/2
          if ((_this.ship.frame_main[main_frame_zindex(hex_pos.x, hex_pos.y, hex_pos.z + 1)] == undefined) ||
              (_this.ship.frame_main[main_frame_zindex(hex_pos.x, hex_pos.y, hex_pos.z + 1)].mod != obj.mod)) {
            res_str += "Module  \"" + name + "_start" + ship[name] + "\" { \""+name_lib+"/" + config + "_start" + ".cfg\" ( " + str_m + " ) } \n";
          }
          if ((_this.ship.frame_main[main_frame_zindex(hex_pos.x, hex_pos.y, hex_pos.z - 1)] == undefined) ||
              (_this.ship.frame_main[main_frame_zindex(hex_pos.x, hex_pos.y, hex_pos.z - 1)].mod != obj.mod)) {
            res_str += "Module  \"" + name + "_end" + ship[name] + "\" { \""+name_lib+"/" + config + "_end" + ".cfg\" ( " + str_m + " ) } \n";
          }
        }

        ship[name]++; //.push(m_flat);
      });
    });

    if (a_name == null) {
      a_name = "Ship";
    }
    var header_str = "Name    \"" + a_name + "\"\n" +
                     "Class   \"" + (MainEngines != 0 ? (hyper_r != 0 ? "Starship" : "Planetship") : "Station") + "\"\n" +
//                     "Pack     \"ACB Shields and Ferms" + "\"\n" +
                     "Pack     \"SpaceEngine" + "\"\n" +
                     "Faction  \"SHW Corp" + "\"\n" +
                     "Mass     " + Math.round(mass*1000) + "\n" + 
//!!! mass = kg, MainEngines = tonn
                     "Quat    (1 0 0 0)\n" +
                     "MainEngines     " + (MainEngines / mass ) + "\n" + 
                     "RetroEngines     " + (RetroEngines / mass ) + "\n" + 
                     "CorrEngines     " + (CorrEngines / mass / 6) + "\n" + 
//!!! Vmain = 3000000 m/s , Vcorr = 100000 m/s, corr axis = 6
                     "HoverEngines 0.0\n" + 
		     "TurnEngines  0.002\n" +
                     "Warpdrive   " + (hyper_r != 0 ? "true" : "false") + "\n" +
                     "WarpBoostLog " + hyper_r + "\n" +
// WarpBoostLog = 6 (hyper_drive) or 8*hyper_ring_thick or 4*hyper_ring
                     "Aerodynamics false\n";
 
    return header_str + res_str;
  }

  // Interface functions
/*  this.load = function(a_files) {
    var fr = new FileReader();
    fr.onload = function(e) {
      try {
        _this.load_ship_store(e.target.result); //+++ lib
      } catch (e) {
        window.alert("Cannot parse file: "+e.toString());
      }
    };
    fr.readAsText(a_files[0]);
  }
*/

  this.set_context = function(a_context) {
    if (_this.cur_context != null) {
      _this.cur_context.deactivate();
    }
    _this.cur_context = a_context;
    if (_this.cur_context != null) {
      _this.cur_context.activate();
    }
    _this.set_ref_plane();
  }

//!!! sel
  this.set_prev_context = function(a_context) {
    if (a_context != undefined){
      if (_this.prev_context == "") _this.prev_context = _this.cur_context;
      _this.set_context(a_context);
    } else {
      if (_this.prev_context != "") {
	_this.set_context(_this.prev_context); 
	_this.prev_context = "";
      }
    }
  }

  this.in_premodify = function(i_obj){
    if (i_obj == undefined) return undefined; //null;
    aa = this.prev_pos[i_obj];
    if (aa == undefined) return undefined; //null;
    else return aa[1];
  }

  this.find_premodify = function(a_obj){
   if (a_obj == undefined) return undefined; //null;
   for (var i in this.prev_pos) {
	aa = this.prev_pos[i];
	if (aa == undefined) continue;
	if (aa[1].parentUndo == a_obj) {
	  return aa[1].parentUndo;
  	}
	if (aa[1] == a_obj) {
	  return aa;
	}
   }
   return undefined; //null;
  }

  this.set_premodify = function(a_obj, amode){
   if ((a_obj == undefined)&&(amode == undefined)){
     this.prev_pos = [];
     return;
   } 
   if ((!a_obj) && (typeof(amode) == "string")) return;
   if (!a_obj.parent) return; //???
//+++ undo   if (a_obj == "0") this.prev_pos.push("0"); 

     var aa;
     switch (""+amode) {
     case "add": //only copy links
	if ((a_obj.parent == this.modules) || (a_obj.parent == this.main_frames)) {
          aa = a_obj; 
	  aa.parentUndo = a_obj.parent;
	} else if (a_obj.parent == this.shilds) {
	  aa = a_obj; 
	  aa.parentUndo = a_obj.parent;
	} else if (a_obj.parent == this.sec_frames) {
          aa = this.ship.frame_sec[a_obj.index];
	  aa.parentUndo = a_obj.parent;
	};
        break;
     case "mod": //clone add array
	if ((a_obj.parent == this.modules) || (a_obj.parent == this.main_frames)) {
	  aa = {p0:a_obj.position.x, p1:a_obj.position.y, p2:a_obj.position.z, p3:angle_Z_by_index(a_obj.index), p4:a_obj.posrota, p5:a_obj.scale.z+","+a_obj.mod}; //+++ rot +++ sca
	  aa.parentUndo = a_obj;
	} else if (a_obj.parent == this.shilds) {
	  var t_layer = a_obj.layer;
	  var tmp = this.ship.shilds[t_layer];
	  aa = {p0:t_layer, p1:tmp.curve, p2:tmp.line, p3:tmp.radius, p4:tmp.circular, p5:tmp.flip};
	  aa.parentUndo = a_obj;
	} else if (a_obj.parent == this.sec_frames) {
          var start_pos = {}; var end_pos = {};
          this.sec_pos_by_index(a_obj.index, start_pos, end_pos);
//	  start_pos = from_hex_half(start_pos); //+++ step = 15/2
//	  end_pos = from_hex_half(end_pos); //+++ step = 15/2
	  aa = {p0:start_pos.x, p1:start_pos.y, p2:start_pos.z, p3:end_pos.x, p4:end_pos.y, p5:end_pos.z};
	  aa.parentUndo = a_obj;
  	};
	break;
     case "del": //only copy links

	if ((a_obj.parent == this.modules) || (a_obj.parent == this.main_frames)) {
	  aa = a_obj; 
	  aa.parentUndo = a_obj.parent;
	} else if (a_obj.parent == this.shilds) {
	  aa = a_obj; 
	  aa.parentUndo = a_obj.parent;
	} else if (a_obj.parent == this.sec_frames) {
          aa = this.ship.frame_sec[a_obj.index];
	  aa.parentUndo = a_obj.parent;
	};
	break;
     default:
	//change object "amode" from this.prev_pos[ ] on object "a_obj"
	 for (var iio in this.prev_pos) {
	  aa = this.prev_pos[iio];
	  if (aa == undefined) continue;
	  if (this.prev_pos[iio][1].parentUndo == amode) {
	    //if (a_obj != undefined) 
		this.prev_pos[iio][1].parentUndo = a_obj;
            //else this.m_editor.prev_pos.splice(iio,1);
	  }
	  if (this.prev_pos[iio][1] == amode) {
	    //if (a_obj != undefined)
		this.prev_pos[iio][1] == a_obj;
	    //else this.m_editor.prev_pos.splice(iio,1);
	  }
	 }
	return; //+++
     }
     this.prev_pos.push([amode, aa]);
}

  this.ret_premodify = function(){
  var repre_pos = [];
  for (; this.prev_pos.length>0; ) {
   var amode = this.prev_pos.pop();
   if (!amode) continue; 
//+++ undo   if (amode === "0") return;
   var a_obj = amode[1]; amode = amode[0];
   switch (amode) {
   case "add": //only delete
	if (a_obj.parentUndo == this.modules) {
          this.delete_module(a_obj.mod, a_obj.index);
	} else if (a_obj.parentUndo == this.main_frames) {
	  this.delete_main_frame(to_hex_half(a_obj.position));
	} else if (a_obj.parentUndo == this.sec_frames) {
	  var start_pos = {}; var end_pos = {};
	  this.sec_pos_by_index(a_obj[0].index, start_pos, end_pos);
          this.delete_sec_frame(start_pos, end_pos);
	} else if (a_obj.parentUndo == this.shilds) {
//+pre учесть последний тайл (см delete_shild)
          this.delete_shild(a_obj.tri_pos.x, a_obj.tri_pos.y, a_obj.layer);
	};
	break;
   case "mod": //
	if (a_obj.parentUndo.parent == this.modules) {
	  var p = a_obj;
	  var p_obj = a_obj.parentUndo;
	  var p_ind = p_obj.index;
	  var scale = p.p5.split(",");
	  if (scale[1] == p_obj.mod) {
	    p_obj.scale.set(scale[0],scale[0],scale[0]);
	    delete this.ship.modules[p_ind];

	    p_obj.position.set(p.p0,p.p1,p.p2);
	    rot_set(p_obj, 0);
	    p_obj.rotation.z = angle_from_hex(p.p3);
	    rot_set(p_obj, p.p4);
          // reindex
	    //p_ind = module_index(p_obj.mod, to_hex_half(p_obj.position), angle_Z_by_index(p_ind));
	    p_ind = module_index(p_obj.mod, to_hex_half(p_obj.position), p.p3); 
	    p_obj.index = p_ind;
	    this.ship.modules[p_ind] = p_obj;

	  } else {
	    this.modules.remove(this.ship.modules[p_ind]);
	    delete this.ship.modules[p_ind];
	    p_obj.position.set(p.p0,p.p1,p.p2);
	    var matroll = (p_obj.material == p_obj.mat.rollOverMaterial);
            p_obj = this.add_module(scale[1], to_hex_half(p_obj.position), p.p3, p.p4); //angle_Z_by_index(p_ind));
	    p_obj.material = (matroll ? p_obj.mat.rollOverMaterial : p_obj.mat.mainMaterial);
	    p_obj.scale.set(scale[0],scale[0],scale[0]);
	  }
	  a_obj.parentUndo = p_obj;
	  p_obj.updateMatrix();
	} else if (a_obj.parentUndo.parent == this.sec_frames) {

          var start_pos = {}; var end_pos = {};
	  var p = a_obj;
	  var p_obj = a_obj.parentUndo;
	  this.sec_pos_by_index(p_obj.index, start_pos, end_pos);
	  var p_ind = p_obj.index; //sec_frame_index(start_pos, end_pos);
	  var secfr = this.ship.frame_sec[p_ind];
	  if (! secfr) {
	        var p_ind = sec_frame_index(end_pos, start_pos);
	        var secfr = this.ship.frame_sec[p_ind];
	        if (! secfr) continue;
	  } 
	  start_pos.x = p.p0; start_pos.y = p.p1; start_pos.z = p.p2;
	  end_pos.x = p.p3; end_pos.y = p.p4; end_pos.z = p.p5; 
	  delete this.ship.frame_sec[p_ind];
	  p_ind = sec_frame_index(start_pos, end_pos);

	  start_pos = from_hex_half(start_pos); //+++ step = 15/2
	  end_pos = from_hex_half(end_pos); //+++ step = 15/2
          var dir = new THREE.Vector3();
          dir.sub(end_pos, start_pos);
          dir.multiplyScalar(0.1);
          var sec = new THREE.Vector3(0, 0, 1);
          sec.crossSelf(dir);
          sec.normalize();


	  if (secfr[0].circle) { //+++ circ
		   
	        var len1 = start_pos.length();
	        var len2 = end_pos.length();
	        // Let make start always farther from main axis.
	        var flip = false;
	        if (len2 > len1) {
	          var tmpos = end_pos;
	          end_pos = start_pos;
	          start_pos = tmpos;
	          flip = !flip;
	        }
	        // Center point of two points
	        var center = start_pos.clone();
	        center.addSelf(end_pos);
	        center.multiplyScalar(0.5);

	        // Calculate center of circle. Let make it lay on long axis.
	        var t = (center.x * sec.y - center.y * sec.x) / (start_pos.x * sec.y - start_pos.y * sec.x);
	        var circle_center = start_pos.clone();
	        circle_center.multiplyScalar(t);
	        circle_center.z = start_pos.z; // circle center will be at the start position depth

	        var r = circle_center.distanceTo(start_pos);
	        var start_pos_local = start_pos.clone().subSelf(circle_center);
	        var end_pos_local = end_pos.clone().subSelf(circle_center);
	        start_angle = Math.atan2(start_pos_local.y, start_pos_local.x);
	        end_angle = Math.atan2(end_pos_local.y, end_pos_local.x);
	        if ((end_angle - start_angle) > Math.PI) {
	          end_angle -= 2 * Math.PI
	        } else if ((end_angle - start_angle) < -Math.PI) {
	          end_angle += 2 * Math.PI
	        }

	        var len_circle = r * Math.abs(end_angle - start_angle);
	        var z_dist =  end_pos.z - start_pos.z;
	        var len = Math.sqrt(len_circle * len_circle, z_dist * z_dist);

	        var model_len = 10;
	        var count = Math.ceil(len / model_len);
	        var angle_step = (end_angle - start_angle) / count;
	        var z_step = z_dist / count;
	        var old_pos = start_pos.clone();

	        for(var itmp = 0; itmp < secfr.length; itmp++) {
		  avox = secfr[itmp];
	          var angle = start_angle + angle_step * (itmp+1);
	          var x = Math.cos(angle) * r;
	          var y = Math.sin(angle) * r;
	          var z = i * z_step;
	          var tpos = circle_center.clone();
	          tpos.addSelf(new THREE.Vector3(x, y, z));

	          var segment_dir = new THREE.Vector3();
	          segment_dir.sub(tpos, old_pos);
	          segment_dir.multiplyScalar(1 / model_len);
	          if (flip) {
	            segment_dir.multiplyScalar(-1);
	          }
	          var segment_sec = new THREE.Vector3(0, 0, 1);
	          segment_sec.crossSelf(segment_dir);
	          segment_sec.normalize();
	          var segment_third = new THREE.Vector3();
	          segment_third.cross(segment_dir, segment_sec);
	          segment_third.normalize();

	          avox.matrix.set(
	            segment_sec.x, segment_sec.y, segment_sec.z, 0,
	            segment_third.x, segment_third.y, segment_third.z, 0,
	            segment_dir.x, segment_dir.y, segment_dir.z, 0,
	            0, 0, 0, 1
	          );
	          avox.matrix.transpose();
	          if (flip) {
	            avox.matrix.setPosition(tpos);
	          } else {
	            avox.matrix.setPosition(old_pos);
	          }
	          old_pos = tpos;
		  avox.index = p_ind;
		}
	  } else {	//+++ circ
	    var third = new THREE.Vector3();
	    third.cross(dir, sec);
	    third.normalize();
	    dir.multiplyScalar(1/Math.ceil(dir.length()));
	    var sec_step = dir.clone();
	    sec_step.multiplyScalar(10);
	    for(var itmp = 0; itmp < secfr.length; itmp++) {
	      avox = secfr[itmp]; 
	      avox.matrix.set(
		           sec.x, sec.y, sec.z, 0,
		           third.x, third.y, third.z, 0,
		           dir.x, dir.y, dir.z, 0,
		           0, 0, 0, 1
	      );
	      avox.matrix.transpose();
	      avox.matrix.setPosition(start_pos);
	      start_pos.addSelf(sec_step);
	      avox.index = p_ind;
	    }
	  }
	  this.ship.frame_sec[p_ind] = secfr;
	} else if (a_obj.parentUndo.parent == this.shilds) {
	  var p = a_obj;
          var t_layer = a_obj.parentUndo.layer; 
          var tmp = this.ship.shilds[t_layer];
          this.ship.shilds[p.p0] = tmp;
	  this.ship.shilds[t_layer] = undefined; //--- delete this.ship.shilds[t_layer];
	  t_layer = p.p0;
	  tmp.curve = p.p1;
	  tmp.line = p.p2;
	  tmp.radius = p.p3;
	  tmp.circular = p.p4;
	  tmp.flip = p.p5;

	  this.ship.shilds[t_layer] = tmp;	  
//???	  this.update_shild_layer(t_layer);
	  this.set_ref_plane();
	  for (var ii in tmp.plates) {
	        var tobj = tmp.plates[ii];
	        if (tobj != undefined) {
	          tobj.matrix = this.get_shild_trans_matrix(tobj.tri_pos, t_layer);
	          tobj.layer = t_layer;
		  tobj.tri_pos.z = t_layer;
	        }
	  }
	  for (var ii in tmp.frames) {
	        var tobj = tmp.frames[ii];
	        if (tobj != undefined) {
	          tobj.matrix = this.get_shild_frame_trans_matrix(ii, t_layer);
	        }
	  }
	  $("#slider_grid").slider("value",this.get_layer()*10); //+++ slid

  	};
	repre_pos.push([amode, a_obj]);
	break;
   case "del": //only add
	if (a_obj.parentUndo == this.modules) {
	  this.modules.add(a_obj);
	  this.ship.modules[a_obj.index] = a_obj;
	} else if (a_obj.parentUndo == this.main_frames) {
          this.main_frames.add(a_obj); var pos = to_hex_half(a_obj.position);
          this.ship.frame_main[main_frame_zindex(pos.x, pos.y, pos.z)] = a_obj;
	} else if (a_obj.parentUndo == this.sec_frames) {
          this.ship.frame_sec[a_obj[0].index] = a_obj;
	  for (var i in a_obj){
	      this.sec_frames.add(a_obj[i]);
	  }
	} else if (a_obj.parentUndo == this.shilds) {
//+pre учесть последний тайл (см delete_shild)
	  var index = shild_index(a_obj.tri_pos.x, a_obj.tri_pos.y);
	  var layer = this.ship.shilds[a_obj.layer];
	  if ((layer == undefined)) continue;
	  if ((layer.plates[index] == undefined)) { 
	    this.shilds.add(a_obj);
	    layer.plates[index] = a_obj;
	  }
	};
	break;
   default:
	// замена новых мешей на старые?
	break;
   }
  }
  if (repre_pos.length>0) this.prev_pos = repre_pos.concat();
}


/*  this.set_prev_matrix = function(a_matrx){
    if (a_matrx){
//	this.prev_matrix.copy(a_matrx);
	var cmp = [];
        cmp = a_matrx.decompose();
	this.prev_matrix.compose(cmp[0],cmp[1],cmp[2]);
    }
    return this.prev_matrix;
  }

  this.get_prev_matrix = function(a_matrx){
    if (a_matrx){
       a_matrx.copy(this.prev_matrix);
    }
  }*/
//!!! sel

  // Set main frame context
  this.set_main_frame_context = function(a_len, a_mod) {
    this.set_prev_context(); 
    this.prev_context = "";
    this.set_context(this.main_frame_context);
    this.main_frame_context.set_len(a_len);
    this.main_frame_context.set_module(a_mod);
  }
  
  // Set secondary frame context
  this.set_sec_frame_context = function(a_mod) {
    this.set_prev_context(); 
    this.prev_context = "";
    this.set_context(this.sec_frame_context);
    this.sec_frame_context.set_module(a_mod);
  }
    
  // Set module context
  this.set_module_context = function(a_module) {
    this.set_prev_context(); 
    this.prev_context = "";
    this.set_context(this.modules_context);
    this.modules_context.set_module(a_module);
  }
  
  // Set shield context
  this.set_shield_context = function(a_mod) {
    this.set_prev_context(); 
    this.prev_context = "";
    this.set_context(this.shild_context);
    this.shild_context.set_module(a_mod);
  }
  
  this.set_main_axis_visible = function(a_visible) {
    this.main_axis.visible = a_visible;//_this.editor_config["Main Axis Visible"];
  }

  this.set_skybox_visible = function(a_visible) {
    this.mesh_cube.visible = (a_visible === undefined) ? !this.mesh_cube.visible: a_visible;
//    if (this.mesh_cube.visible) this.scene.add(mesh_cube); else this.scene.remove(mesh_cube);
//    scene.updateMatrixWorld(); //???
  }

  this.set_grid_visible = function(a_visible) {
    this.plane.visible = a_visible;//_this.editor_config["Grid Visible"];
  }
  
  this.set_shadows_visible = function(a_visible) {
    //this.directionalLight.castShadow = a_visible;
    this.renderer.shadowMapEnabled = a_visible;
    for (material in materials) {
      materials[material].mainMaterial.needsUpdate = true;
    }
    //this.renderer.updateShadowMap(this.scene, this.camera);
//!!! lampo
    this.directionalLight2.visible = 0+!a_visible;
    this.directionalLight2.intensity = 0+!a_visible;
//!!! lampo
  }
  
  this.set_grid_pos = function(a_pos){
    this.plane.position.z = a_pos;
    this.set_ref_plane();
  }
  
  this.get_layer = function() {
    return layer(this.plane.position.z);
2  }
  
  this.set_ref_plane = function() {
    var plane_z = this.plane.position.z;
    var plane_vis = this.plane.visible;
    this.plane.visible = false;
    if (this.get_circular_shield() && this.cur_context == this.shild_context) {
      this.plane = this.plane_c;
    } else {
      this.plane = this.plane_h;
    }
    this.plane.visible = plane_vis;
    this.plane.position.z = plane_z;
  }
  
  this.set_circular_shield = function(a_val) {
    var l = this.get_layer();
    if (this.ship.shilds[l] != undefined) {
      this.ship.shilds[l].circular = a_val;
      this.update_shild_layer(l);
    }
    this.set_ref_plane();
  }
  
  this.get_circular_shield = function() {
    var l = this.get_layer();
    return this.ship.shilds[l] == undefined ? false : this.ship.shilds[l].circular;
  }
    
  this.set_flip_shield = function (a_val) {
    var l = this.get_layer();
    if (this.ship.shilds[l] != undefined) {
      this.ship.shilds[l].flip = a_val;
      this.update_shild_layer(l);
    }
    this.set_ref_plane();
  }

  this.get_flip_shield = function () {
    var l = this.get_layer();
    return this.ship.shilds[l] == undefined ? false : this.ship.shilds[l].flip;
  }

  this.set_curve = function (a_val) {
    var l = this.get_layer();
    if (this.ship.shilds[l] != undefined) {
      this.ship.shilds[l].curve = a_val;
      this.update_shild_layer(l);
    }
  }
  this.get_curve = function() {
    var l = this.get_layer();
    return this.ship.shilds[l] == undefined ? 0 : this.ship.shilds[l].curve;
  }
  
  this.set_line = function(a_val){
    var l = this.get_layer();
    if (this.ship.shilds[l] != undefined) {
      this.ship.shilds[l].line = a_val;
      this.update_shild_layer(l);
    }
  }
  this.get_line = function() {
    var l = this.get_layer();
    return this.ship.shilds[l] == undefined ? 0 : this.ship.shilds[l].line;
  }

  this.set_radius = function(a_val){
    var l = this.get_layer();
    if (this.ship.shilds[l] != undefined) {
      this.ship.shilds[l].radius = a_val;
      this.update_shild_layer(l);
    }
  }
  this.get_radius = function() {
    var l = this.get_layer();
    return this.ship.shilds[l] == undefined ? 0 : this.ship.shilds[l].radius;
  }

  ///////////////////////////
  this.add_roll_over = function(a_geo, a_material) {
    var mesh = new THREE.Mesh(a_geo, materials[a_material].rollOverMaterial);
    mesh.doubleSided = true; //+++
    this.rollovers.add(mesh);
    mesh.visible = false;
    return mesh;
  }

  this.on_models_loaded = function () {
    // Main frame geometry
    /*_this.frame_6geo = _this.models_loader.model("frame6");
    _this.frame_6x3geo = _this.models_loader.model("frame6x3");
    _this.frame_6x9geo = _this.models_loader.model("frame6x9");*/

    // Set context
//    _this.set_context(_this.main_frame_context);
//    _this.main_frame_context.set_len(1);

    // Handlers
    _this.container.addEventListener('mousemove', _this.onDocumentMouseMove, false);
    _this.container.addEventListener('mousedown', _this.onDocumentMouseDown, false);
    _this.container.addEventListener('mouseup', _this.onDocumentMouseUp, false);
    _this.container.addEventListener('contextmenu', function (event) { event.preventDefault(); }, false);
    document.addEventListener('keydown', _this.onDocumentKeyDown, false);
    document.addEventListener('keyup', _this.onDocumentKeyUp, false);
    if (_this.container.addEventListener) {
      _this.container.addEventListener("mousewheel", _this.onMouseWheel, false);
      _this.container.addEventListener("DOMMouseScroll", _this.onMouseWheel, false);
    } else {
      _this.container.attachEvent("onmousewheel", _this.onMouseWheel);
    }

//    document.getElementById("interface").style.display = 'block';

//    // Hide loading label
//    _this.loading.style.display = 'none';

    // Simplex calculations
    /*var simplex = new THREE.Mesh(_this.models_loader.model("shild"), _this.mainMaterial);
    simplex.position.copy(new THREE.Vector3());
    simplex.castShadow = true;
    simplex.receiveShadow = true;
    simplex.matrixAutoUpdate = false;
    simplex.updateMatrix();
    _this.scene.add(simplex);*/

    // Base simplex points
    var r = 15.0 / Math.cos(Math.PI / 6) / 2.0;
    _this.simplex_points = [
      new THREE.Vector3(0, 0, -15 / Math.sqrt(2)),
      new THREE.Vector3(r, 0, 1),
      new THREE.Vector3(-r * sin30, r * cos30, 1),
      new THREE.Vector3(-r * sin30, -r * cos30, 1),
    ];

    // Transformed simplex points
    /*var simplex_points_tr = [];
    for (var i = 0; i < simplex_points.length; ++i) { //??? no i++
    simplex_points_tr[i] = _this.simplex_points[i].clone();
    }
    simplex_points_tr[0].z = -20;
    simplex_points_tr[1].z = -5;
    simplex_points_tr[2].z = 2;*/

    // Simplex matrix
    var s = _this.simplex_points;
    var simplex_matrix = new THREE.Matrix4(
      s[0].x, s[0].y, s[0].z, 1,
      s[1].x, s[1].y, s[1].z, 1,
      s[2].x, s[2].y, s[2].z, 1,
      s[3].x, s[3].y, s[3].z, 1
    );

    // Invert simplex matrix
    _this.inv_simplex = new THREE.Matrix4();
    _this.inv_simplex.getInverse(simplex_matrix);

    /*s = simplex_points_tr;
    var simplex_matrix_trans = new THREE.Matrix4(
    s[0].x, s[0].y, s[0].z, 1,
    s[1].x, s[1].y, s[1].z, 1,
    s[2].x, s[2].y, s[2].z, 1,
    s[3].x, s[3].y, s[3].z, 1
    );
    
    var transform = new THREE.Matrix4();
    transform.multiply(inv_simplex, simplex_matrix_trans);
    transform.transpose();
    
    simplex.matrix = transform.clone();

    var t = transform.getColumnX();
    console.log("X: " + t.x + ", " + t.y + ", " + t.z);
    t = transform.getColumnY();
    console.log("Y: " + t.x + ", " + t.y + ", " + t.z);
    t = transform.getColumnZ();
    console.log("Z: " + t.x + ", " + t.y + ", " + t.z);
    t = transform.getPosition();
    console.log("pos: " + t.x + ", " + t.y + ", " + t.z);
    
    // Draw points
    var sphere = new THREE.SphereGeometry(0.3, 4, 4);
    for (var i = 0; i < simplex_points_tr.length; ++i) { //??? no i++
    var point = new THREE.Mesh(sphere);
    point.position.copy(simplex_points_tr[i]);
    _this.scene.add(point);
    }*/
  }

  /*function getRealIntersector(intersects) {
    for(i = 0; i < intersects.length; i++) {
      intersector = intersects[ i ];
      if (intersector.object != rollOverMesh) {
        return intersector;
      }
    }
    return null;
  }*/
  
  this.get_symmetry_positions = function(pos, angle) {
//    if (angle != undefined) {
//      angle = angle_from_hex(angle_to_hex(angle));
//    }
    //pos = from_hex(to_hex(pos));
    var voxel_positions = [];
    //this.symmetry = this.editor_config["Symmetry"];
    voxel_positions[0] = {pos:pos.clone(), a:angle};
    if (this.symmetry > 1 && (pos.x != 0 || pos.y != 0 || angle !== undefined)) {
      var da = Math.PI * 2 / this.symmetry;
      var a = (pos.x != 0 || pos.y != 0) ? Math.atan2(pos.y, pos.x) : 0;
      var d = Math.sqrt(pos.x * pos.x + pos.y * pos.y);
      var tmp = pos.clone();
      for (var i = 1; i < this.symmetry; ++i) {

//alert("symm i="+i+" angle="+angle+" a="+a);

        a += da;
        angle += da;
        a = (a >= Math.PI * 2) ? a-Math.PI * 2 : a; //??? while (a >= Math.PI * 2) {a -= Math.PI * 2}; 
        angle = (angle >= Math.PI * 2) ? angle-Math.PI * 2 : angle; //??? while (angle >= Math.PI * 2) {angle -= Math.PI * 2};

//alert(" ang="+angle_to_hex(a));
//alert(" ang="+a+"\n angl="+angle+"\n Pi2="+Math.PI * 2);
        tmp.x = d * Math.cos(a);
        tmp.y = d * Math.sin(a);
        voxel_positions[i] = {pos:tmp.clone(), a:angle};
      }
    }
    return voxel_positions;
  }

//+++ step = 15/2
  this.get_symmetry_positions_hex_half = function(hex_pos, hex_angle) {
    var pos = from_hex_half(hex_pos);
    var positions = this.get_symmetry_positions(pos, (hex_angle !== undefined) ? angle_from_hex(hex_angle) : hex_angle);
    for (i in positions) {
      positions[i].pos = to_hex_half(positions[i].pos);
      positions[i].a = angle_to_hex(positions[i].a);
    }
    return positions;
  }

  /*function setVoxelPosition(intersector) {
    tmpVec.copy(intersector.face.normal);
    voxelPosition.add(intersector.point, intersector.object.matrixRotationWorld.multiplyVector3(tmpVec));
    var hex_pos = to_hex(voxelPosition);
    voxelPosition = from_hex(hex_pos);
    voxel_positions = [];
    symmetry = editor_config["Symmetry"];
    voxel_positions[0] = voxelPosition.clone();
    if (symmetry > 1 && (hex_pos.x != 0 || hex_pos.y != 0)) {
      var da = Math.PI * 2 / symmetry;
      var a = Math.atan2(voxelPosition.y, voxelPosition.x);
      var d = Math.sqrt(voxelPosition.x * voxelPosition.x + voxelPosition.y * voxelPosition.y);
      var tmp = voxelPosition.clone();
      for (var i = 1; i < symmetry; ++i) {
        a += da;
        tmp.x = d * Math.cos(a);
        tmp.y = d * Math.sin(a);
        voxel_positions[i] = tmp.clone();
      }
    }
  }*/
  
  this.delete_main_frame = function(a_pos) {
    var index = main_frame_zindex(a_pos.x, a_pos.y, a_pos.z);
    if ((this.ship.frame_main[index] != undefined)) { //  && (this.ship.frame_main[index] != null)
      this.main_frames.remove(this.ship.frame_main[index]);
      delete this.ship.frame_main[index];
    }
  }
  
  this.delete_sec_frame = function(pos1, pos2) {
    var index = sec_frame_index(pos1, pos2);
    if (this.ship.frame_sec[index] != undefined) { // && (this.ship.frame_sec[index] != null)) 
      for (var i = 0; i < this.ship.frame_sec[index].length; ++i) { //??? no i++
        this.sec_frames.remove(this.ship.frame_sec[index][i]);
      }
      delete this.ship.frame_sec[index];
    }

    //!!! sec
    index = sec_frame_index(pos2, pos1);
    if (this.ship.frame_sec[index] != undefined) { 
      for (var i = 0; i < this.ship.frame_sec[index].length; ++i) { //??? no i++
        this.sec_frames.remove(this.ship.frame_sec[index][i]);
      }
      delete this.ship.frame_sec[index];
    }
    //!!! sec
  }
  
  this.delete_module = function(a_mod, a_index) {
    if ((this.ship.modules[a_index] != undefined)) { // && this.ship.modules[a_index] != null)
      if (this.ship.modules[a_index].mod == a_mod) { //??? name a_mod included in a_index
        this.modules.remove(this.ship.modules[a_index]);
        delete this.ship.modules[a_index];
      }
    }
  }
  
  this.get_neighbourhood_shild_plates = function(x, y) {
    var res = [
      {x:x, y:y-1},
      {x:x, y:y+1}
    ];
    if (tri_inv_int(x, y)) {
      res.push({x: x+1, y:y});
    } else {
      res.push({x: x-1, y:y});
    }
    return res;
  }

  this.delete_shild = function(x, y, z) {
    if ((this.ship.shilds[z] != undefined)) { // && (this.ship.shilds[z] != null)
      var layer = this.ship.shilds[z];
      var index = shild_index(x, y);
      if ((layer.plates[index] != undefined)) { // && (layer.plates[index] != null)
        this.shilds.remove(layer.plates[index]);
        delete layer.plates[index];
        var neigh = this.get_neighbourhood_shild_plates(x, y);
        var p = {x:x, y:y};
        for (i in neigh) {
          var index_frame = shild_frame_index(p, neigh[i]);
          if ((layer.frames[index_frame] != undefined)) { // && (layer.frames[index_frame] != null)
            this.shild_frames.remove(layer.frames[index_frame]);
            delete layer.frames[index_frame];
          }
        }
      }
    }

    /*if ((layer.plates[index] == undefined) ||
        (layer.plates[index] == null)) {
    var index = main_frame_index(x, y, z);
    if ((this.ship.shilds[index] != undefined) &&
        (this.ship.shilds[index] != null)) {
      this.shilds.remove(this.ship.shilds[index]);
      this.ship.shilds[index] = undefined;
    }*/
  }


  this.add_main_frame = function(x, y, z_start, len, a_mod) {
    var abs_len = Math.abs(len);
    if (len < 0) {
      z_start -= abs_len - 1;
    }
    var a_frames = [];
    for (var z = z_start; z < z_start + abs_len; ++z) {
      var index = main_frame_zindex(x, y, z);
      if ((this.ship.frame_main[index] == undefined)) { // || (this.ship.frame_main[index] == null)
        var material = materials[main_frames[a_mod].material];
        var pos = from_hex_half(new THREE.Vector3(x, y, z)); //+++ step = 15/2
        var voxel = new THREE.Mesh(
          this.models_loader.model(a_mod), 
          material.mainMaterial
        );
        voxel.mod = a_mod;
        voxel.mat = material;
        voxel.position.copy(pos);
        voxel.rotation.z = angle_from_hex(angle_to_hex(angle_Z_by_pos(voxel.position),true)); //!!! rot 
        voxel.castShadow = true;
        voxel.receiveShadow = true;
        voxel.matrixAutoUpdate = false;
        voxel.doubleSided = true;
        voxel.updateMatrix();
        this.main_frames.add(voxel);

        this.ship.frame_main[index] = voxel;
	a_frames.push(voxel);
      }
    }
    return a_frames;
  }
  
  this.add_sec_frame = function(a_pos1, a_pos2, a_mod, a_cycle) {
    var index = sec_frame_index(a_pos1, a_pos2);
    if ((this.ship.frame_sec[index] == undefined) &&   // || (this.ship.frame_sec[index] == null)
//!!! sec
	(this.ship.frame_sec[sec_frame_index(a_pos2, a_pos1)] == undefined)  // || (this.ship.frame_sec[sec_frame_index(a_pos2, a_pos1)] == null) 
       ) {
      var start_pos = from_hex_half(a_pos1); //+++ step = 15/2
      var end_pos = from_hex_half(a_pos2); //+++ step = 15/2

      var dir = new THREE.Vector3();
      dir.sub(end_pos, start_pos);
      dir.multiplyScalar(0.1);
      //m.setColumnZ(dir);
      var sec = new THREE.Vector3(0, 0, 1);
      sec.crossSelf(dir);
      sec.normalize();
      //m.setColumnX(sec);
      var third = new THREE.Vector3();
      third.cross(dir, sec);
      third.normalize();

      var start_angle = Math.atan2(start_pos.y, start_pos.x);
      var end_angle = Math.atan2(end_pos.y, end_pos.x);
      var diff_angle = start_angle - end_angle;

      if (a_cycle &&  // this.circul_across runded frames / plates
          ((start_pos.x != 0 && start_pos.y != 0) || (end_pos.x != 0 && end_pos.y != 0) && // no point at the origin
          Math.abs(diff_angle % Math.PI) > 0.01)) {  // points are on different angles
        var len1 = start_pos.length();
        var len2 = end_pos.length();
        // Let make start always farther from main axis.
        var flip = false;
        if (len2 > len1) {
          var tmp = end_pos;
          end_pos = start_pos;
          start_pos = tmp;
          flip = !flip;
        }
        // Center point of two points
        var center = start_pos.clone();
        center.addSelf(end_pos);
        center.multiplyScalar(0.5);
        
        // Calculate center of circle. Let make it lay on long axis.
        var t = (center.x * sec.y - center.y * sec.x) / (start_pos.x * sec.y - start_pos.y * sec.x);
        var circle_center = start_pos.clone();
        circle_center.multiplyScalar(t);
        circle_center.z = start_pos.z; // circle center will be at the start position depth

        var r = circle_center.distanceTo(start_pos);
        var start_pos_local = start_pos.clone().subSelf(circle_center);
        var end_pos_local = end_pos.clone().subSelf(circle_center);
        start_angle = Math.atan2(start_pos_local.y, start_pos_local.x);
        end_angle = Math.atan2(end_pos_local.y, end_pos_local.x);
        if ((end_angle - start_angle) > Math.PI) {
          end_angle -= 2 * Math.PI
          //flip = !flip;
        } else if ((end_angle - start_angle) < -Math.PI) {
          end_angle += 2 * Math.PI
        }

        var len_circle = r * Math.abs(end_angle - start_angle);
        var z_dist =  end_pos.z - start_pos.z;
        var len = Math.sqrt(len_circle * len_circle, z_dist * z_dist);

        var model_len = 10;
        var count = Math.ceil(len / model_len);
        var angle_step = (end_angle - start_angle) / count;
        var z_step = z_dist / count;

        var old_pos = start_pos.clone();

        var material = materials[sec_frames[a_mod].material];
        this.ship.frame_sec[index] = [];

        for (var i = 1; i <= count; ++i) { // Does not metter, you can use i++, but in our company code standard it is restricted.
          var angle = start_angle + angle_step * i;
          var x = Math.cos(angle) * r;
          var y = Math.sin(angle) * r;
          var z = i * z_step;

          var pos = circle_center.clone();
          pos.addSelf(new THREE.Vector3(x, y, z));

          var segment_dir = new THREE.Vector3();
          segment_dir.sub(pos, old_pos);
          segment_dir.multiplyScalar(1 / model_len);
          if (flip) {
            segment_dir.multiplyScalar(-1);
          }
          var segment_sec = new THREE.Vector3(0, 0, 1);
          segment_sec.crossSelf(segment_dir);
          segment_sec.normalize();
          var segment_third = new THREE.Vector3();
          segment_third.cross(segment_dir, segment_sec);
          segment_third.normalize();

          var voxel = new THREE.Mesh(
            this.models_loader.model(a_mod), 
            material.mainMaterial
          );

          voxel.castShadow = true;
          voxel.receiveShadow = true;
          voxel.matrixAutoUpdate = false;
          voxel.index = index;
          voxel.circle = true;	//+++ circ
          voxel.mod = a_mod;
          voxel.mat = material;
          voxel.doubleSided = true;

          voxel.matrix.set(
            segment_sec.x, segment_sec.y, segment_sec.z, 0,
            segment_third.x, segment_third.y, segment_third.z, 0,
            segment_dir.x, segment_dir.y, segment_dir.z, 0,
            0, 0, 0, 1
          );
          voxel.matrix.transpose();
          if (flip) {
            voxel.matrix.setPosition(pos);
          } else {
            voxel.matrix.setPosition(old_pos);
          }
          old_pos = pos;

          this.sec_frames.add(voxel);
          this.ship.frame_sec[index].push(voxel);
        }
      } else {
        //m.setColumnX(sec);
        var third = new THREE.Vector3();
        third.cross(dir, sec);
        third.normalize();
        //m.setColumnY(third);
        var len = dir.length();
        var count = Math.ceil(len);
        dir.multiplyScalar(1/count);
        var sec_step = dir.clone();
        sec_step.multiplyScalar(10);
        
        var material = materials[sec_frames[a_mod].material];
        this.ship.frame_sec[index] = [];
        for (var i = 0; i < count; ++i) { //??? no i++
          var voxel = new THREE.Mesh(
            this.models_loader.model(a_mod), 
            material.mainMaterial
          );

          voxel.castShadow = true;
          voxel.receiveShadow = true;
          voxel.matrixAutoUpdate = false;
          voxel.index = index;
          voxel.circle = false;	//+++ circ
          voxel.mod = a_mod;
          voxel.mat = material;
          voxel.doubleSided = true;
          //voxel.updateMatrix();      

          voxel.matrix.set(
            sec.x, sec.y, sec.z, 0,
            third.x, third.y, third.z, 0,
            dir.x, dir.y, dir.z, 0,
            0, 0, 0, 1
          );
          voxel.matrix.transpose();
          voxel.matrix.setPosition(start_pos);
          start_pos.addSelf(sec_step);

          this.sec_frames.add(voxel);
          this.ship.frame_sec[index].push(voxel);
        }
      }
      return this.ship.frame_sec[index];
    }
    return false;
  }
    
//+++ rot +++sel
 this.module_by_index = function(a_index) {
  var mod = null;
  var arr = a_index.split(";");
  if (modules[arr[0]].multiple) {
    mod = this.ship.modules[a_index];
  } else {
    for (var i = 0; i < 12; i++) {
      arr[4] = i*50; // *100
      mod = this.ship.modules[arr.join(";")];
      if ((mod != undefined)) return mod; //  && (mod != null)
    }    
  }
  return mod;
 }

 this.sec_frame_by_index = function(a_index) {
  var mo = this.ship.frame_sec[a_index];
  if (mo != undefined)   // || (this.ship.frame_sec[a_index] == null)
    return mo;
  mo = a_index.split(";");
//  [mo[0],mo[4]] = [mo[4],mo[0]];
//  mo = mo.join(";");
  var no = []; no.concat(mo[3],mo[4],mo[1],mo[2]);
  mo = no.join(";");
//alert("index="+a_index+" mo="+mo);
  return this.ship.frame_sec[mo];
}

  this.sec_pos_by_index = function(a_index, a_pos1, a_pos2) {
    var itmp = a_index.split(";");
    a_pos1.x = parseFloat(itmp[0])/100; a_pos1.y = parseFloat(itmp[1])/100; a_pos1.z = parseFloat(itmp[2])/100;
    a_pos2.x = parseFloat(itmp[3])/100; a_pos2.y = parseFloat(itmp[4])/100; a_pos2.z = parseFloat(itmp[5])/100;
  }

  this.add_module = function(a_module, h_pos, h_angle, a_rot, a_scale) { //+++ rot  //+++ sca
    if (!a_rot) a_rot = 0; 
    if (!a_scale) a_scale = 1;

    var index = module_index(a_module, to_hex_half(from_hex_half(h_pos)), h_angle); //*100  round pos for index

    if ((modules[a_module] == undefined)) return false; // || (modules[a_module] == null)
    if (!this.module_by_index(index)) {
      var material = materials[modules[a_module].material];
      var voxel = new THREE.Mesh(
        this.models_loader.model(a_module),
        material.mainMaterial
      );
      voxel.position.copy(from_hex_half(h_pos)); //+++ step = 15/2
      voxel.rotation.z = angle_from_hex(h_angle);
      voxel.posrota = 0; //+++ rot
      if (a_rot != 0) rot_set(voxel, a_rot); //+++ rot
      voxel.castShadow = true;
      voxel.receiveShadow = true;
      voxel.matrixAutoUpdate = false;

      voxel.scale.set(a_scale,a_scale,a_scale);  //+++ sca

      voxel.updateMatrix();
      voxel.index = index;
      voxel.mod = a_module;
      voxel.mat = material;

      voxel.doubleSided = true;
      this.modules.add(voxel);
      this.ship.modules[index] = voxel;
      return voxel; //true;
    }
    return false;
  }
//+++ rot +++sel


  this.add_shild = function(a_pos, a_mod) {
    var index = shild_index(a_pos.x, a_pos.y);
    var layer_idx = a_pos.z;
    var layer;
    if ((this.ship.shilds[layer_idx] == undefined)) { // || (this.ship.shilds[layer_idx] == null)
      layer = {
        curve : 0.0,
        line : 0.0,
        radius : 0.0,
        plates : [],
        frames : [],
        circular: false,
        flip: false
      }
      this.ship.shilds[layer_idx] = layer;
    } else {
      layer = this.ship.shilds[layer_idx];
    }

    if ((layer.plates[index] == undefined)) { // || (layer.plates[index] == null)
      var material = materials[shields[a_mod].material];
      var voxel = new THREE.Mesh(
        this.models_loader.model(a_mod), 
        material.mainMaterial
      );

      //voxel.position.copy(from_tri(a_pos));
      //voxel.rotation.z = tri_inv(a_pos) ? Math.PI : 0;
      //voxel.rotation.x = Math.PI;
      voxel.castShadow = true;
      voxel.receiveShadow = true;
      voxel.matrixAutoUpdate = false;
      //voxel.updateMatrix();      
      voxel.index = index;
      voxel.layer = layer_idx;
      voxel.tri_pos = new THREE.Vector3(a_pos.x, a_pos.y, a_pos.z);
      voxel.matrix = this.get_shild_trans_matrix(a_pos, layer_idx);
      voxel.position.copy(voxel.matrix.getPosition());
      voxel.mod = a_mod;
      voxel.mat = material;

      this.shilds.add(voxel);
      layer.plates[index] = voxel;

      // shild frames
      var neighs = this.get_neighbourhood_shild_plates(a_pos.x, a_pos.y);
      var p = { x: a_pos.x, y: a_pos.y };
      for (var i in neighs) {
        var neigh = neighs[i];
        var index_neigh = shild_index(neigh.x, neigh.y);
        if ((layer.plates[index_neigh] != undefined)) { // && (layer.plates[index_neigh] != null)
          var index_frame = shild_frame_index(p, neigh);
          if ((layer.frames[index_frame] == undefined)) { // || (layer.frames[index_frame] == null)
            voxel = new THREE.Mesh(this.models_loader.model("shild_frame"), materials["default"].mainMaterial);
            voxel.castShadow = true;
            voxel.receiveShadow = true;
            voxel.matrixAutoUpdate = false;
            voxel.matrix = this.get_shild_frame_trans_matrix(index_frame, layer_idx);
            voxel.position.copy(voxel.matrix.getPosition());
            voxel.mat = materials["default"]; //Part of shields

            this.shild_frames.add(voxel);
            layer.frames[index_frame] = voxel;
          }
        }
      }

      /*var s = [];
      for (var i = 0; i < this.simplex_points.length; ++i) { //??? no i++
        var p = this.simplex_points[i].clone();
        // transform to plate position
        p = voxel.matrix.multiplyVector3(p);
        // transform by parabola
        p.z -= 0.003 * (p.x * p.x + p.y * p.y);
        s[i] = p;
      }
      var center = s[1].clone();
      center.addSelf(s[2]);
      center.addSelf(s[3]);
      center.multiplyScalar(1/3);
      
      var v1 = s[1].clone();
      v1.subSelf(s[2]);
      var v2 = s[1].clone();
      v2.subSelf(s[3]);
      v1.crossSelf(v2);
      v1.normalize();
      v1.multiplyScalar(-15 / Math.sqrt(2) - 1);
      s[0].add(center, v1);
      
      var simplex_matrix_trans = new THREE.Matrix4(
        s[0].x, s[0].y, s[0].z, 1,
        s[1].x, s[1].y, s[1].z, 1,
        s[2].x, s[2].y, s[2].z, 1,
        s[3].x, s[3].y, s[3].z, 1
      );
      
      voxel.matrix.multiply(this.inv_simplex, simplex_matrix_trans);
      voxel.matrix.transpose();*/
      return layer.plates[index];
    }
    return false;
  }

  this.get_shild_trans_matrix = function (a_pos, a_layer) {
    var tri_pos = new THREE.Vector3(a_pos.x, a_pos.y, a_pos.z);
    tri_pos.z = a_layer;
    var pos = from_tri(tri_pos);
    var m = new THREE.Matrix4();
    m.setPosition(pos);
    if (tri_inv(tri_pos)) {
      m.rotateZ(Math.PI);
    }

    var layer = this.ship.shilds[a_layer];
    if (layer != undefined && layer.flip) { // && layer != null
      m.rotateX(Math.PI);
    }

    var s = [];
    for (var i = 0; i < this.simplex_points.length; ++i) { //??? no i++
      var p = this.simplex_points[i].clone();
      // transform to plate position
      p = m.multiplyVector3(p);
      /*var tan30 = sin30 / cos30;
      var ax = Math.abs(p.x);
      var ay = Math.abs(p.y);
      var tan = Math.atan2(ay, ax);
      var r_t = (tan > tan30) ? (ax * tan30 + ay) : (ax / cos30);
      var r = Math.sqrt(p.x * p.x + p.y * p.y);
      if (r > 0) {
        p.x *= r_t / r;
        p.y *= r_t / r;
      }*/
      if (layer != undefined && layer.circular) { // && layer != null
        var c = hex2circ(p.x, p.y);
        p.x *= c;
        p.y *= c;
      }

      // transform by parabola
      if (layer != undefined) { // && layer != null
        p.z -= 0.0001 * layer.curve * (p.x * p.x + p.y * p.y - layer.radius * layer.radius) + 
               (Math.sqrt(p.x * p.x + p.y * p.y) - layer.radius) * Math.tan(layer.line * Math.PI / 180);
      }
      s[i] = p;
    }
    var center = s[1].clone();
    center.addSelf(s[2]);
    center.addSelf(s[3]);
    center.multiplyScalar(1 / 3);

    var v1 = s[1].clone();
    v1.subSelf(s[2]);
    var v2 = s[1].clone();
    v2.subSelf(s[3]);
    v1.crossSelf(v2);
    v1.normalize();
    v1.multiplyScalar(-15 / Math.sqrt(2) - 1);
    s[0].add(center, v1);

    var simplex_matrix_trans = new THREE.Matrix4(
      s[0].x, s[0].y, s[0].z, 1,
      s[1].x, s[1].y, s[1].z, 1,
      s[2].x, s[2].y, s[2].z, 1,
      s[3].x, s[3].y, s[3].z, 1
    );

    m.multiply(this.inv_simplex, simplex_matrix_trans);
    m.transpose();

    return m;
  }

  this.get_shild_frame_trans_matrix = function(index_frame, layer_idx) {
    var m = new THREE.Matrix4();

    var arr = index_frame.split(";");
    var pos1 = {};
    var pos2 = {};
    pos1.x = parseInt(arr[0],10);
    pos1.y = parseInt(arr[1],10);
    pos1.z = layer_idx;
    pos2.x = parseInt(arr[2],10);
    pos2.y = parseInt(arr[3],10);
    pos2.z = layer_idx;

    pos1 = "" + pos1.x + ";" + pos1.y; //??? shild_index(pos1.x, pos1.y);
    pos2 = "" + pos2.x + ";" + pos2.y; //??? shild_index(pos2.x, pos2.y);

    var plate1 = this.ship.shilds[layer_idx].plates[pos1];
    var plate2 = this.ship.shilds[layer_idx].plates[pos2];

    // transform to plate position
    var start_pos = this.simplex_points[0].clone();
    start_pos.z += 1;
    start_pos = plate1.matrix.multiplyVector3(start_pos);
    var end_pos = this.simplex_points[0].clone();
    end_pos.z += 1;
    end_pos = plate2.matrix.multiplyVector3(end_pos);

    var dir = new THREE.Vector3();
    dir.sub(end_pos, start_pos);
    dir.multiplyScalar(0.1);
    //m.setColumnZ(dir);
    var sec = new THREE.Vector3(0, 0, this.ship.shilds[layer_idx].flip ? -1 : 1);
    sec.crossSelf(dir);
    sec.normalize();
    //m.setColumnX(sec);
    var third = new THREE.Vector3();
    third.cross(dir, sec);
    third.normalize();
    //m.setColumnY(third);

    m.set(
      dir.x, dir.y, dir.z, 0,
      sec.x, sec.y, sec.z, 0,
      third.x, third.y, third.z, 0,
      0, 0, 0, 1
    );
    m.transpose();
    m.setPosition(start_pos);

    return m;
  }

  this.update_shild_layer = function(a_l) {
    if (this.ship.shilds[a_l] != undefined) {
      var plates = this.ship.shilds[a_l].plates;
      for (i in plates) {
        var plate = plates[i];
        if (plate != undefined) { // && plate != null
          plate.matrix = this.get_shild_trans_matrix(plate.tri_pos, a_l);
        }
      }
      var frames = this.ship.shilds[a_l].frames;
      for (i in frames) {
        var frame = frames[i];
        if (frame != undefined) { // && frame != null
          frame.matrix = this.get_shild_frame_trans_matrix(i, a_l);
        }
      }
    }
  }

/*  this.ModifyModule = function(a_context) {
    return;
  }*/

  this.onDocumentMouseMove = function(event) {
    event.preventDefault();

    _this.mouse2D.x = (event.clientX / window.innerWidth) * 2 - 1;
    _this.mouse2D.y = - (event.clientY / window.innerHeight) * 2 + 1;

    _this.camera_control.onMouseMove(event);
  }
  
  this.onDocumentMouseDown = function(event) {
    event.preventDefault();
    
    if (event.button == 0) {

//!!! sel
      if (_this.cur_context == _this.modify_context){
	if (_this.isModify) {
	  if  (!_this.isShiftDown) {
	    _this.set_prev_context(); //+++ 
	    _this.isModify = false; //+++ 
	    _this.isAccuracy = false; //+++ 
	    return;
	  }
	}
      }
//!!! sel 

      if (_this.cur_context != null) {
        _this.cur_context.mouse_down(_this.ray);
      }


    } else {
      _this.camera_control.onMouseDown(event);
    }
  }
  
  this.onDocumentMouseUp = function(event) {
    event.preventDefault();
    if (event.button != 0) {
      _this.camera_control.onMouseUp(event);
    } else {
      if (_this.cur_context != null) {
        _this.cur_context.mouse_up(_this.ray);
      }
    }
  }
  
  this.onMouseWheel = function(e) {
	  _this.camera_control.onMouseWheel(e);
	  return false;
  }


  this.onDocumentKeyDown = function(event) {
//  alert("key "+event.keyCode);
    switch(event.keyCode) {
      case 17: {
//???        if (_this.isCtrlDown || _this.isShiftDown) break; 
        _this.isCtrlDown = true;
        if (_this.cur_context != _this.delete_context) _this.set_prev_context(_this.delete_context);
	_this.isModify = false; //!!! sel
        break;
      }
//!!! sel
      case 16: {
//???        if (_this.isCtrlDown || _this.isShiftDown) break; 
	_this.isShiftDown = true;
	if (_this.cur_context != _this.modify_context) {
	  _this.isModify = false; //+++ 
	  _this.isAccuracy = false; //+++ 
	  _this.set_prev_context(_this.modify_context);
	}
	break;
      }

/*      case 122:{ //skybox
	_this.set_skybox_visible(false);
        break;
      }*/

      case  27:{//Esc
	if (_this.cur_context == _this.modify_context) _this.isModeModify = 0
	else _this.ret_premodify();
        break;
      }
//      case  48://"0"
      case  96:{//num0 
        if ((_this.cur_context == _this.modify_context) && _this.isModify) {_this.isAccuracy = !_this.isAccuracy;}
	break;
      }
      case  68: 
      case 102:{
	if ((_this.cur_context == _this.modify_context) && _this.isModify) {_this.isModeModify = 6;}
	break;
      }
      case  65: 
      case 100:{	
	if ((_this.cur_context == _this.modify_context) && _this.isModify) {_this.isModeModify = 4;}
	break;
      }
      case 69:
      case 105:{
	if ((_this.cur_context == _this.modify_context) && _this.isModify) {_this.isModeModify = 9;}
	break;
      }
      case 67:
      case 99:{
	if ((_this.cur_context == _this.modify_context) && _this.isModify) {_this.isModeModify = 3;}
	break;
      }
      case 81:
      case 103:{
	if ((_this.cur_context == _this.modify_context) && _this.isModify) {_this.isModeModify = 7;}
	break;
      } 
      case 90:
      case 97:{
	if ((_this.cur_context == _this.modify_context) && _this.isModify) {_this.isModeModify = 1;}
	break;
      } 

      case  190: //>
	var ModeDir = -1;
      case  188: //<
 { 
    if (_this.isModify) break;
//    if (! _this.isShiftDown) break;

    if (! ModeDir) var ModeDir = 1;
   _this.set_premodify();
	if ((_this.ship.shilds[100*ModeDir] != undefined) 
//	    || ((iarr[0].split(";")[0]*ModeDir)==10000)  // *100
//	    || ((iarr[iarr.length-1].split(";")[0]*ModeDir)==10000)  // *100
	   ) break;

	  var iarr = {};
          for_each(_this.ship.frame_main, function(i, mod) {
              mod.position.z += ModeDir*stepz;
	      i = to_hex_half(mod.position);
	      iarr[main_frame_zindex(i.x, i.y, i.z)] = mod;
	      mod.updateMatrix();
          });
	  _this.ship.frame_main = {}; _this.ship.frame_main = iarr; iarr = {};

          for_each(_this.ship.modules, function(i, mod) {
              mod.position.z += ModeDir*stepz; 
	      i = module_index(mod.mod, to_hex_half(mod.position), angle_Z_by_index(i));
	      mod.index = i;
	      iarr[i] = mod;
	      mod.updateMatrix();
          });
	  _this.ship.modules = {}; _this.ship.modules = iarr; iarr = {};

		//+++ sec_frame_index
          var avox; var start_pos = {}; var end_pos = {}; 
          for_each(_this.ship.frame_sec, function(i, mod) {
	      _this.sec_pos_by_index(i, start_pos, end_pos);
	      start_pos.z += ModeDir;  end_pos.z += ModeDir;
	      i = sec_frame_index(start_pos, end_pos);

	      iarr[i] = mod;
	      start_pos = from_hex_half(start_pos); //+++ step = 15/2
	      end_pos = from_hex_half(end_pos); //+++ step = 15/2

	      var dir = new THREE.Vector3();
	      dir.sub(end_pos, start_pos);
	      dir.multiplyScalar(0.1);
	      var sec = new THREE.Vector3(0, 0, 1);
	      sec.crossSelf(dir);
	      sec.normalize();
	      var third = new THREE.Vector3();
	      third.cross(dir, sec);
	      third.normalize();
	      dir.multiplyScalar(1/Math.ceil(dir.length()));
	      var sec_step = dir.clone();
	      sec_step.multiplyScalar(10);

	      for(var itmp = 0; itmp < mod.length; itmp++) {
		 avox = mod[itmp]; 
	         avox.matrix.set(
	           sec.x, sec.y, sec.z, 0,
	           third.x, third.y, third.z, 0,
	           dir.x, dir.y, dir.z, 0,
	           0, 0, 0, 1
	         );
	         avox.matrix.transpose();
	         avox.matrix.setPosition(start_pos);
	         start_pos.addSelf(sec_step);
		 avox.index = i;
	      }
	      
          });
	  _this.ship.frame_sec = {}; _this.ship.frame_sec = iarr; 

	  iarr = [];
	  //for_each(_this.ship.shilds, function(i, layer) {
///	  for (var i = -99; i <= 100; i++ ) {
//	  for (var i = 99; i >= -100; i-- ) {
	  for (var i = ModeDir*99; Math.abs(i) <= 100; ModeDir>0 ? i-- : i++ ) {
	      iarr = _this.ship.shilds[i];
	      _this.ship.shilds[i+ModeDir] = iarr;
	      if (iarr == undefined ) continue;
	      //i++; iarr[i] = layer;
	      for (var ii in iarr.plates) {
	        var plate = iarr.plates[ii];
	        if (plate != undefined) {
	          plate.matrix = _this.get_shild_trans_matrix(plate.tri_pos, i+ModeDir);
	          plate.layer += ModeDir;
		  plate.tri_pos.z = plate.layer;
	        }
	      }

	      for (var ii in iarr.frames) {
	        var frame = iarr.frames[ii];
	        if (frame != undefined) {
	          frame.matrix = _this.get_shild_frame_trans_matrix(ii, i+ModeDir);
	        }
	      }
	  }
          _this.ship.shilds[-ModeDir*100] = null;
	  //});	    _this.ship.shilds = []; _this.ship.shilds = iarr; iarr = {};
    
          $("#slider_grid").slider("value",_this.get_layer()*10); //+++ slid

        break;
      }
      case 83:
      case 101:{
	if (_this.cur_context == _this.modify_context) if (_this.isModify) _this.isModeModify = 5;
        break;
      }
/*      case 87:
      case 104:{
	if (_this.cur_context == _this.modify_context) _this.isModeModify = 8;
        break;
      }
      case 88:
      case 98:{
	if (_this.cur_context == _this.modify_context) _this.isModeModify = 2;
        break;
      }*/
      case 189: //+++ sca
      case 109:{ //+++ sca
//	if (_this.cur_context == _this.modify_context) if (_this.isModify) _this.isModeModify = 10;
//	if (_this.cur_context == _this.modules_context) 
	  _this.isModeModify = 10;
        break;
      }
      case 187: //+++ sca
      case 107:{ //+++ sca
//	if (_this.cur_context == _this.modify_context) if (_this.isModify) _this.isModeModify = 11;
//	if (_this.cur_context == _this.modules_context) 
	  _this.isModeModify = 11;
        break;
      }
//!!! sel
    }
  }

  this.onDocumentKeyUp = function(event) {
    switch(event.keyCode) {
      case 17: {
        _this.isCtrlDown = false;
        _this.set_prev_context();
        break;
      }
      case 16: {//!!! sel 
	_this.isShiftDown = false;
	if (! _this.isModify) _this.set_prev_context();  
	//!!! sel
	break;
      }
/*      case 65:
      case 100:{
	_this.isModeModify = -1;
        break;
      }
      case 68:
      case 102:{
	_this.isModeModify = -1;
        break;
      }*/
    }
  }
  
  this.onWindowResize = function(event) {
    _this.SCREEN_WIDTH = window.innerWidth;
    _this.SCREEN_HEIGHT = window.innerHeight;

    _this.renderer.setSize(_this.SCREEN_WIDTH, _this.SCREEN_HEIGHT);

    _this.camera.aspect = _this.SCREEN_WIDTH / _this.SCREEN_HEIGHT;
    _this.camera.updateProjectionMatrix();
  }

  this.save = function() {
    window.open(this.renderer.domElement.toDataURL('image/png'), 'mywindow');
  }

  //////

  this.animate = function() {
    requestAnimationFrame(_this.animate);

    _this.render();
    _this.stats.update();
  }

  this.render = function() {
    this.camera_control.update();

    this.ray = this.projector.pickingRay(this.mouse2D.clone(), this.camera);
    
    if (this.cur_context != null) {
      this.cur_context.update(this.ray);
    }

    /*var intersects = ray.intersectObjects(scene.children);
    if (intersects.length > 0) {
      intersector = getRealIntersector(intersects);
      if (intersector && (rollOverMesh != null)) {
        setVoxelPosition(intersector);
        rollOverMesh.position = voxelPosition;
        rollOverMesh.visible = true;
      } else if (rollOverMesh != null) {
        rollOverMesh.visible = false;
      }
    } else if (rollOverMesh != null) {
      rollOverMesh.visible = false;
    }*/

    this.renderer.render(this.scene, this.camera);
  }

  this.models_loader = new ModelsLoader(this.on_models_loaded);
  this.texture_manager = new TextureManager();
  this.init();
}
