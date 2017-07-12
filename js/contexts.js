// Base context
BaseContext = function(a_editor) {
  this.m_editor = a_editor;
	this.m_module = "";

	this.m_roll_overs = new Array();
	this.m_roll_over_mesh = null;

  this.activate = function() {};

  this.deactivate = function() {
    if (this.m_roll_over_mesh != undefined) {
      this.m_roll_over_mesh.visible = false;
    }
  }

  this.mouse_down = function(ray) {};
  this.mouse_up = function(ray) {};
  //this.mouse_move = function(ray) {};
  this.update = function(ray) {};

  this.set_module = function(a_mod) {
    this.m_module = a_mod;
    this.deactivate();
    this.activate();
  }
}

// Main frame context
MainFrameContext = function(a_editor) {
	BaseContext.call(this, a_editor);
	
	/*this.m_roll_over_mesh = null;
	this.m_roll_over_mesh_x1 = null;
	this.m_roll_over_mesh_x3 = null;
	this.m_roll_over_mesh_x9 = null;*/
	
    this.m_module = "main_frame_base";
    this.m_len = 1;

  this.activate = function() {
    if (this.m_roll_overs.length == 0) {
      for (mod in main_frames) {
        this.m_roll_overs[mod] = {};
        this.m_roll_overs[mod]["1"] = this.m_editor.add_roll_over(
            this.m_editor.models_loader.model(mod),
            main_frames[mod].material
          );

        for (r in main_frames[mod].rollovers) {
          this.m_roll_overs[mod][r] = this.m_editor.add_roll_over(
              this.m_editor.models_loader.model(mod + r),
              main_frames[mod].material
            );
        }
      }
    }
    this.m_roll_over_mesh = this.m_roll_overs[this.m_module]["" + this.m_len];
    if (this.m_roll_over_mesh != undefined) {
      this.m_roll_over_mesh.visible = true; 
    }
	  /*if (this.m_roll_over_mesh == null) {
      this.m_roll_over_mesh_x1 = this.m_editor.add_roll_over(this.m_editor.frame_6geo);
      this.m_roll_over_mesh_x3 = this.m_editor.add_roll_over(this.m_editor.frame_6x3geo);
      this.m_roll_over_mesh_x9 = this.m_editor.add_roll_over(this.m_editor.frame_6x9geo);
    }
    switch (this.m_len) {
      case 1: this.m_roll_over_mesh = this.m_roll_over_mesh_x1; break;
      case 3: this.m_roll_over_mesh = this.m_roll_over_mesh_x3; break;
      case 9: this.m_roll_over_mesh = this.m_roll_over_mesh_x9; break;
      default: console.log("Unsupported count");
    }*/
  }
    
  this.set_len = function(a_len) {
    this.m_len = a_len;
    this.deactivate();
    this.activate();
  }
  
  this.mouse_down = function(ray) {
    var intersector = intersect(ray,
      [this.m_editor.main_frames, this.m_editor.scene]);
    if (intersector != null) {

//+++ step = 15/2
      // Snap to main frames
      if (intersector.object.parent == this.m_editor.main_frames) {
        var pos = to_hex_half(intersector.point,true); //??? step = 15/2
      } else {
        var pos = to_hex(intersector.point); //??? step = 15/2
      }
      var len = this.m_len * (intersector.face.normal.z < 0 ? -1 : 1);
      if (intersector.face.normal.z != 0) {
        var positions = this.m_editor.get_symmetry_positions_hex_half(pos); //??? step = 15/2

        //+++ undo this.m_editor.set_premodify("0");
	this.m_editor.set_premodify();

        for (i in positions) {
          var pos = positions[i].pos;
          var aframe = this.m_editor.add_main_frame(pos.x, pos.y, pos.z, len, this.m_module); //??? step = 15/2
	  for (var imsh in aframe) this.m_editor.set_premodify(aframe[imsh], "add");
        }
      }
    }
  };

  this.update = function(ray) {
    var intersector = intersect(ray,
      [this.m_editor.main_frames, this.m_editor.scene]);

    if (intersector != null) {
      if (intersector.object.parent == this.m_editor.main_frames) {
        var pos = snap_half2(intersector.point,true); //+++ step = 15/2
      }else{ 
        var pos = snap(intersector.point); //??? step = 15/2
      }
      if (intersector.face.normal.z != 0) {
        pos.z += (this.m_len - 1) / 2 * stepz * 
          (intersector.face.normal.z < 0 ? -1 : 1);
        this.m_roll_over_mesh.visible = true;
      } else {
        this.m_roll_over_mesh.visible = false;
      }
      this.m_roll_over_mesh.position = pos;
    } else {
      this.m_roll_over_mesh.visible = false;
    }
  };
}

MainFrameContext.prototype = new BaseContext();
MainFrameContext.prototype.constructor = MainFrameContext;

// Modules context
ModulesContext = function(a_editor) {
  BaseContext.call(this, a_editor);
  this.m_scale = 1; //+++ sca
	
  this.activate = function() {
   this.m_scale = 1; //+++ sca
   if (this.m_roll_overs.length == 0) {
    for (mod in modules) {
        this.m_roll_overs[mod] = 
          this.m_editor.add_roll_over(
            this.m_editor.models_loader.model(mod),
            modules[mod].material
          );
      }
    }
    this.m_roll_over_mesh = this.m_roll_overs[this.m_module];
    if (this.m_roll_over_mesh != undefined) {
      this.m_roll_over_mesh.visible = true;
    }
   }
      
  this.mouse_down = function(ray) {
    if (this.m_roll_over_mesh.visible) {
      var positions = this.m_editor.get_symmetry_positions_hex_half( //??? pos on intersector.point  //err? a>Pi*2
        to_hex_half(this.m_roll_over_mesh.position), angle_to_hex(this.m_roll_over_mesh.rotation.z)); //+++ step = 15/2

      //+++ undo this.m_editor.set_premodify("0");
      this.m_editor.set_premodify();

      for (var i in positions) {
	var module = this.m_editor.add_module(this.m_module, positions[i].pos, positions[i].a, 0, this.m_roll_over_mesh.scale.x); //+++ sca

        this.m_editor.set_premodify(module, "add"); //this.m_roll_over_mesh

        if (module && _addframes) { //!!! rot !!! no add frame !!! step = 15/2
          module = modules[this.m_module];
          var rot_mat = new THREE.Matrix4();
          rot_mat.rotateZ(angle_from_hex(positions[i].a));

          if (! module.attachment) continue; //!!!

          for (var j = 0; j < module.attachment.length; ++j) {
            var pos = from_hex_half(positions[i].pos); //+++ step = 15/2
            var delta_pos = new THREE.Vector3(module.attachment[j][0], module.attachment[j][1], module.attachment[j][2]);
            delta_pos = from_hex_half(delta_pos); //+++ step = 15/2            delta_pos = from_hex(delta_pos);
            delta_pos = rot_mat.multiplyVector3(delta_pos);
            pos.subSelf(delta_pos);
            var hex_pos = to_hex_half(pos,true); //+++ step = 15/2
            var aframe = this.m_editor.add_main_frame(hex_pos.x, hex_pos.y, hex_pos.z, 1, "main_frame_base"); //+++ step = 15/2
	    for (var imsh in aframe) this.m_editor.set_premodify(aframe[imsh], "add");
          }
        }
      }
    }
  };

  this.update = function(ray) {
      if (this.m_roll_over_mesh == undefined) return;
      switch (this.m_editor.isModeModify) {
//+++ sca
        case 11: var ModeDir = 1; //+ 
        case 10: { //-
          if (! ModeDir) ModeDir = -1;
	  var m_varsize = modules[this.m_module].varsize;
	  if (! m_varsize) break;
	  var t_scal = this.m_roll_over_mesh.scale.z;
	  var tmp = chek_arr(m_varsize, function(i, vol){if (vol >= t_scal) return i; else return undefined;});
	  if (tmp != undefined) {
		//check one obj
	        tmp = (ModeDir >0) ? 
		    m_varsize[(tmp < (m_varsize.length-1)) ? ++tmp : tmp] 
		  : m_varsize[(tmp > 0) ? --tmp : tmp];

	        if (tmp.length) {
    	    // resetcontext

	        } else {
		  this.m_scale = tmp;
	        }
	  }
          break;
//+++ sca
	}
      }
      this.m_editor.isModeModify = -1;
      this.m_roll_over_mesh.scale.set(this.m_scale, this.m_scale, this.m_scale); //+++ sca

      var intersector = intersect(ray,
        [this.m_editor.main_frames, this.m_editor.scene]);
      if (intersector != null) {
        var attach_angle = 0;
        var module = modules[this.m_module];
        // Snap to main frames
        if (intersector.object.parent == this.m_editor.main_frames) {
          var pos = snap_half2(intersector.point,(_poshalf == 1));  //+++ step = 15/2 
          var angle = snap_vector_to_angle(intersector.face.normal,(!this.m_editor.axis6)) - intersector.object.rotation.z; //+++
          var angle_hex = angle_to_hex(angle,(!this.m_editor.axis6));
	  if (module.attachment) {
            var best_attachment = module.attachment[0];
            for (var i = 1; i < module.attachment.length; ++i) {
              if (module.attachment[i][3] == angle_hex) {
                best_attachment = module.attachment[i];
                break;
              } 
            }
	  } else {
            var best_attachment = [0,0,0,0]; //??? angle 0.5 for correct attaching !?
	  }
          var rot_mat = new THREE.Matrix4();
          var delta_pos = new THREE.Vector3(best_attachment[0], best_attachment[1], 0);

	  // for check incorrect param attachment +++ angle 0.5 
	  //if ((best_attachment[0] == 0) && (best_attachment[1] == 0) && (best_attachment[3] == 0)) 
	  //    best_attachment[3] = 0.5;

          attach_angle = angle_from_hex(best_attachment[3]) + (this.m_editor.axis6 ? 0.5 : 0) - angle;
          rot_mat.rotateZ(attach_angle);
          delta_pos = from_hex(delta_pos); //+++ step = 15/2
          delta_pos = rot_mat.multiplyVector3(delta_pos);
          pos.addSelf(delta_pos);
        } else {
	  var pos = snap(intersector.point);
          attach_angle = angle_from_hex(angle_to_hex(angle_Z_by_pos(pos),(!this.m_editor.axis6)));

        }
        this.m_roll_over_mesh.position = pos;
        this.m_roll_over_mesh.rotation.z = attach_angle;
        this.m_roll_over_mesh.visible = true;
      } else {
        this.m_roll_over_mesh.visible = false;
      }
  };
}

ModulesContext.prototype = new BaseContext();
ModulesContext.prototype.constructor = ModulesContext;

// Secondary frame context
SecFrameContext = function(a_editor) {
	BaseContext.call(this, a_editor);
	this.m_mouse_down = false;
	this.m_start_pos;
	this.m_end_pos;
	this.m_module = "sec_frame_base";
	
  this.activate = function() {
    if (this.m_roll_overs.length == 0) {
      for (mod in sec_frames) {
        this.m_roll_overs[mod] = 
          this.m_editor.add_roll_over(
            this.m_editor.models_loader.model(mod),
            sec_frames[mod].material
          );
        this.m_roll_overs[mod].matrixAutoUpdate = false;
      }
    }
    this.m_roll_over_mesh = this.m_roll_overs[this.m_module];
    this.m_start_pos = null;
    this.m_end_pos = null;
  }

  this.innerpos = function(apos) {
    var inpos = apos.clone();
// уменьшить x,y на halfpos к центру меша или 0, 0

    return inpos;
  }
  
  this.mouse_down = function(ray) {
    if (this.m_roll_over_mesh != undefined) {
      var intersector = intersect(ray,
        [this.m_editor.main_frames, this.m_editor.scene]); //+++ atta this.m_editor.modules, 
///        [this.m_editor.main_frames]);

///      if (intersector != null &&
///          intersector.face.normal.z == 0) {
      if (intersector != null ) {  //+++ atta

	interobj = intersector.object;
	if (interobj.parent == this.m_editor.modules) {
//alert("secfram+ "+interobj);

	}

	this.m_start_pos = to_hex_half(intersector.point,(_poshalf == 1)); //+++ step = 15/2
							//to_hex_half(intersector.point,true); //+++ step = 15/2
      }
    }
  };

  this.mouse_up = function(ray) {
    if (this.m_start_pos != undefined && 
        this.m_end_pos != undefined &&
        this.m_roll_over_mesh.visible) {
      var start_positions = this.m_editor.get_symmetry_positions_hex_half(this.m_start_pos); //+++ step = 15/2
      var end_positions = this.m_editor.get_symmetry_positions_hex_half(this.m_end_pos); //+++ step = 15/2

      //+++ undo this.m_editor.set_premodify("0");
      this.m_editor.set_premodify();

      if (start_positions.length == 1) {
        for (var i = 0; i < end_positions.length; ++i) {
          var aobj = editor.add_sec_frame(start_positions[0].pos, end_positions[i].pos, this.m_module, this.m_editor.circul_across); //+++ circ
          this.m_editor.set_premodify(aobj[0], "add");
        }
      } else if (end_positions.length == 1) {
        for (var i = 0; i < start_positions.length; ++i) {
          var aobj = editor.add_sec_frame(start_positions[i].pos, end_positions[0].pos, this.m_module, this.m_editor.circul_across); //+++ circ
          this.m_editor.set_premodify(aobj[0], "add");
        }
      } else {
        for (var i = 0; i < (start_positions.length > end_positions.length ? start_positions.length : end_positions.length); ++i) {
          var aobj = editor.add_sec_frame(start_positions[i].pos, end_positions[i].pos, this.m_module, this.m_editor.circul_across); //+++ circ
          this.m_editor.set_premodify(aobj[0], "add");
        }
      }

    }
    /*if (this.m_roll_over_mesh.visible) {
      var positions = this.m_editor.get_symmetry_positions(
        this.m_roll_over_mesh.position
      );
      for (i in positions) {
        var pos_tri = to_tri(positions[i].pos);
        this.m_editor.add_shild(pos_tri);
      }
    }*/

    this.m_end_pos = undefined;
    this.m_start_pos = undefined;
    this.m_roll_over_mesh.visible = false;
  };

  this.update = function(ray) {
    if (this.m_start_pos != undefined) {
      var intersector = intersect(ray,
        [this.m_editor.main_frames, this.m_editor.scene]); //+++ atta this.m_editor.modules, 
//        this.m_editor.main_frames, this.m_editor.scene]);

///      if (intersector != null && 
///          intersector.face.normal.z == 0) {
      if (intersector != null ) {  //+++ atta

	interobj = intersector.object;
	if (interobj.parent == this.m_editor.modules) {	}

        this.m_end_pos = to_hex_half(intersector.point,(_poshalf == 1)); //+++ step = 15/2
							//to_hex_half(intersector.point,true); //+++ step = 15/2

//        if ((this.m_end_pos.x == this.m_start_pos.x) && 
//            (this.m_end_pos.y == this.m_start_pos.y) &&
//            (this.m_end_pos.z != this.m_start_pos.z)) {alert("adad")}

        if ((this.m_end_pos.x != this.m_start_pos.x) || 
            (this.m_end_pos.y != this.m_start_pos.y)) {
          this.m_roll_over_mesh.visible = true;
          var m = this.m_roll_over_mesh.matrix;

          var start_pos = from_hex(this.m_start_pos); //+++ step = 15/2
          var end_pos = from_hex(this.m_end_pos); //+++ step = 15/2
          
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
          //m.setColumnY(third);
          
          m.set(
            sec.x, sec.y, sec.z, 0,
            third.x, third.y, third.z, 0,
            dir.x, dir.y, dir.z, 0,
            0, 0, 0, 1
          );
          m.transpose();
          m.setPosition(start_pos);
          
          return;
        }
      }

      this.m_roll_over_mesh.visible = false;
    }

    /*if (this.m_roll_over_mesh != undefined) {
      var intersector = intersect(ray,
        [this.m_editor.scene]);

      if (intersector != null) {
        var pos_tri = to_tri(intersector.point);
        var pos = from_tri(pos_tri);
        this.m_roll_over_mesh.position = pos;
        this.m_roll_over_mesh.rotation.z = tri_inv(pos_tri) ? Math.PI : 0;
        this.m_roll_over_mesh.visible = true;
      } else {
        this.m_roll_over_mesh.visible = false;
      }
    }*/
  };
}

SecFrameContext.prototype = new BaseContext();
SecFrameContext.prototype.constructor = SecFrameContext;

// Shild context
ShildContext = function(a_editor) {
	BaseContext.call(this, a_editor);
	this.m_module = "shield_base";
	
	this.activate = function() {
	  if (this.m_roll_overs.length == 0) {
	    for (mod in shields) {
        this.m_roll_overs[mod] = 
          this.m_editor.add_roll_over(
            this.m_editor.models_loader.model(mod),
            shields[mod].material
          );
      }
    }
    this.m_roll_over_mesh = this.m_roll_overs[this.m_module];
    if (this.m_roll_over_mesh != undefined) {
      this.m_roll_over_mesh.visible = true;
      this.m_roll_over_mesh.matrixAutoUpdate = false;
    }
  }
  
  this.mouse_down = function(ray) {
    if (this.m_roll_over_mesh.visible) {
      //+++ undo this.m_editor.set_premodify("0");
      this.m_editor.set_premodify();

      var temp_pos = this.m_roll_over_mesh.position.clone();
      if (this.m_editor.get_circular_shield()) {
        var c = circ2hex(temp_pos.x, temp_pos.y);
        temp_pos.x *= c;
        temp_pos.y *= c;
      }
      var positions = this.m_editor.get_symmetry_positions(temp_pos);
      for (i in positions) {
        var pos_tri = to_tri(positions[i].pos);
        pos_tri.z = this.m_roll_over_mesh.layer;
        var shld = this.m_editor.add_shild(pos_tri, this.m_module);
        this.m_editor.set_premodify(shld ,"add");
      }
    }
  };

  this.update = function(ray) {
    if (this.m_roll_over_mesh != undefined) {
      var intersector = intersect(ray,
        [this.m_editor.scene]);

      if (intersector != null) {
        if (this.m_editor.get_circular_shield()) {
          var c = circ2hex(intersector.point.x, intersector.point.y);
          intersector.point.x *= c;
          intersector.point.y *= c;
        }
        var pos_tri = to_tri(intersector.point);
        //var pos = from_tri(pos_tri);
        //this.m_roll_over_mesh.position = pos;
        //this.m_roll_over_mesh.rotation.z = tri_inv(pos_tri) ? Math.PI : 0;
        this.m_roll_over_mesh.matrix = this.m_editor.get_shild_trans_matrix(pos_tri, pos_tri.z);
        this.m_roll_over_mesh.position.copy(this.m_roll_over_mesh.matrix.getPosition());
        this.m_roll_over_mesh.visible = true;
        this.m_roll_over_mesh.layer = pos_tri.z;
      } else {
        this.m_roll_over_mesh.visible = false;
      }
    }
  };
}

ShildContext.prototype = new BaseContext();
ShildContext.prototype.constructor = ShildContext;

// Delete context
DeleteContext = function(a_editor) {
	BaseContext.call(this, a_editor);
	this.m_selected_mesh = null;

  this.deactivate = function() {
    if (this.m_selected_mesh != null) {
      this.m_selected_mesh.material = this.m_selected_mesh.mat.mainMaterial;
    }
  }
  
  this.mouse_down = function(ray) {
   if (this.m_selected_mesh != null) {

    ////this.m_editor.delete_object(this.m_selected_mesh);
    //+++ undo this.m_editor.set_premodify("0");
    this.m_editor.set_premodify();

    var a_obj = this.m_selected_mesh;
    if (a_obj.parent == this.m_editor.main_frames) {
      var positions = this.m_editor.get_symmetry_positions_hex_half(
			to_hex_half(a_obj.position)); //+++ step = 15/2
      for (i in positions) {
        var pos = positions[i].pos;
        this.m_editor.set_premodify(this.m_editor.ship.frame_main[main_frame_zindex(pos.x, pos.y, pos.z)] , "del");
        this.m_editor.delete_main_frame(pos);
      }
    } else if (a_obj.parent == this.m_editor.modules) {
      var positions = this.m_editor.get_symmetry_positions_hex_half(
			to_hex_half(a_obj.position), angle_Z_by_index(a_obj.index)); //+++ step = 15/2
      for (i in positions) {
        var index = module_index(a_obj.mod, positions[i].pos, positions[i].a); //??? rot
        this.m_editor.set_premodify(this.m_editor.ship.modules[index], "del"); //this.m_editor.module_by_index(index)
        this.m_editor.delete_module(a_obj.mod, index);
      }
    } else if (a_obj.parent == this.m_editor.sec_frames) {
      var start_pos = {};
      var end_pos = {};
      this.m_editor.sec_pos_by_index(a_obj.index, start_pos, end_pos);
      var start_positions = this.m_editor.get_symmetry_positions_hex_half(start_pos); //+++ step = 15/2
      var end_positions = this.m_editor.get_symmetry_positions_hex_half(end_pos); //+++ step = 15/2
      for (var i = 0; i < (start_positions.length > end_positions.length ? start_positions.length : end_positions.length); ++i) {

	start_pos = (i > start_positions.length-1) ? start_positions[0].pos : start_positions[i].pos;
	end_pos = (i > end_positions.length-1) ? end_positions[0].pos : end_positions[i].pos;

	if (this.m_editor.ship.frame_sec[sec_frame_index(start_pos, end_pos)]) {
	  this.m_editor.set_premodify(this.m_editor.ship.frame_sec[sec_frame_index(start_pos, end_pos)][0], "del");
          this.m_editor.delete_sec_frame(start_pos, end_pos);
	} else if (this.m_editor.ship.frame_sec[sec_frame_index(end_pos, start_pos)]) {
	  this.m_editor.set_premodify(this.m_editor.ship.frame_sec[sec_frame_index(end_pos, start_pos)][0], "del");
          this.m_editor.delete_sec_frame(end_pos, start_pos);
	} else continue;
      }
    } else if (a_obj.parent == this.m_editor.shilds) {
      var tmp_pos = from_tri(a_obj.tri_pos);
      var positions = this.m_editor.get_symmetry_positions(tmp_pos);
      for (i in positions) {
        var tmp_pos = positions[i].pos.clone();
        /*if ((this.m_editor.ship.shilds[a_obj.layer] != undefined) &&
             this.m_editor.ship.shilds[a_obj.layer].circular) {
          var c = circ2hex(tmp_pos.x, tmp_pos.y);
          tmp_pos.x *= c;
          tmp_pos.y *= c;
        }*/
        var pos = to_tri(tmp_pos);
        var layer = this.m_editor.ship.shilds[pos.z];
        var index = shild_index(pos.x, pos.y);
        if ((layer.plates[index] != undefined)) { 
          this.m_editor.set_premodify(layer.plates[index], "del");
          this.m_editor.delete_shild(pos.x, pos.y, a_obj.layer);
        }
      }
    }
    this.m_selected_mesh.material = msh.mat.mainMaterial;
    this.m_selected_mesh = null;
   }
  };

  this.update = function(ray) {
    if (this.m_selected_mesh != null) {
      this.m_selected_mesh.material = this.m_selected_mesh.mat.mainMaterial;
    }
    var intersector = intersect(ray,
      [this.m_editor.main_frames, this.m_editor.sec_frames, this.m_editor.modules, this.m_editor.shilds]);
    if (intersector != null) {
      this.m_selected_mesh = intersector.object;
      this.m_selected_mesh.material = this.m_selected_mesh.mat.delected_material; //!!! not selected_material
    }
  };
}

DeleteContext.prototype = new BaseContext();
DeleteContext.prototype.constructor = DeleteContext;

// Modify context
ModifyContext = function(a_editor) {
  BaseContext.call(this, a_editor);
  this.m_selected_mesh = null;


  this.unroll_premodify = function() {
      for (var iiobj in this.m_editor.prev_pos) {
	var msh = this.m_editor.in_premodify(iiobj).parentUndo;
        if (msh != undefined) 
	 if (msh.parent == this.m_editor.sec_frames) {
	   var aframes = this.m_editor.ship.frame_sec[msh.index];
	   for (var iio=0; iio < aframes.length; iio++) { //+++
	     var mod = aframes[iio];
	     mod.material = mod.mat.mainMaterial;
	   }
	 } if (msh.parent == this.m_editor.shilds) {
	   var aplates = this.m_editor.ship.shilds[msh.tri_pos.z].plates;
	   for (var iio in aplates) { //+++
	     var mod = aplates[iio];
	     mod.material = mod.mat.mainMaterial;
	   }
	 } else	
	   msh.material = msh.mat.mainMaterial;
      }
  }

  this.activate = function() {
    if (this.m_roll_overs.length == 0) {
      for (mod in modules) {
        this.m_roll_overs[mod] = 
          this.m_editor.add_roll_over(
            this.m_editor.models_loader.model(mod),
            modules[mod].material
          );
      }
    }
  }

  this.deactivate = function() {
    if (this.m_editor.isModify) {
      this.unroll_premodify();
      //this.m_editor.set_premodify(); //??? undo for only in isModify?
      this.m_editor.isModify = false;
    }
    document.getElementById("shield_toolbar").style.display = document.getElementById("grid_toolbar").style.display;
    if (this.m_selected_mesh) {
      this.m_selected_mesh.material = this.m_selected_mesh.mat.mainMaterial;
    }
  }

  this.mouse_down = function(ray) {

    if (this.m_selected_mesh.parent == this.m_editor.shilds) {
	//+++ slid
	document.getElementById("shield_toolbar").style.display = "block";
	this.m_editor.set_grid_pos(this.m_selected_mesh.layer*10);
	$("#slider_grid").slider("value",this.m_selected_mesh.layer*10);
	//+++ slid
    } else {
	if (!this.m_selected_mesh) 	return; //no selected or select on selected
	document.getElementById("shield_toolbar").style.display = document.getElementById("grid_toolbar").style.display;
    }

    if (this.m_editor.isModify) {
      // all mshs - mat.mainMaterial
	this.unroll_premodify();
    }
    this.m_editor.isModify = true;
    this.m_editor.set_premodify(); // clear previous modify mshs
// установить новые по симметрии
    var a_obj = this.m_selected_mesh;

    if (a_obj.parent == this.m_editor.modules) {
      var positions = this.m_editor.get_symmetry_positions_hex_half(
			to_hex_half(a_obj.position), angle_Z_by_index(a_obj.index)); //+++ step = 15/2
      var poslen = positions.length; 
      var getobj = function(apos, aobj){
			return editor.ship.modules[module_index(aobj.mod, apos.pos, apos.a)];
		   };
      var setroll = function(aobj){aobj.material = aobj.mat.rollOverMaterial;};

    } else if (a_obj.parent == this.m_editor.sec_frames) {
      var start_pos = {};
      var end_pos = {};
      this.m_editor.sec_pos_by_index(a_obj.index, start_pos, end_pos);
      var end_positions = this.m_editor.get_symmetry_positions_hex_half(end_pos); //+++ step = 15/2
      var positions = this.m_editor.get_symmetry_positions_hex_half(start_pos); //start_positions //+++ step = 15/2
      var startposlen = positions.length; var endposlen = end_positions.length;
      var poslen = (startposlen > endposlen) ? startposlen : endposlen;
      for (var i=poslen-1; i >=0; i--){
        positions[i] = [ ((i > startposlen-1) ? positions[0].pos : positions[i].pos),
			((i > endposlen-1) ? end_positions[0].pos : end_positions[i].pos) ];
      }

      var getobj = function(apos, aobj){ // this parameters: apos[0] == start_pos, apos[1] == end_pos
	var ind = sec_frame_index(apos[0], apos[1]);
	var reind = sec_frame_index(apos[1], apos[0]);
	if (editor.ship.frame_sec[ ind ]) {
	  return editor.ship.frame_sec[ ind ][0];
	} else if (editor.ship.frame_sec[ reind ]) {
	  return editor.ship.frame_sec[ reind ][0];
	} else return;
		    };
      var setroll = function(aobj){
			for (var iio=0; iio < editor.ship.frame_sec[aobj.index].length; iio++) { //+++
			  var mod = editor.ship.frame_sec[aobj.index][iio];
			  mod.material = mod.mat.rollOverMaterial;
			}
		    };

    } else if (a_obj.parent == this.m_editor.shilds) {
      //voxel_positions[0] = {pos:pos.clone(), a:angle};
      var positions = [{pos:from_tri(a_obj.tri_pos).clone(), a:0}];
      var poslen = 1;
      var getobj = function(apos, aobj){
			return a_obj
		   };
      var setroll = function(aobj){
			var layer = editor.ship.shilds[aobj.tri_pos.z];
			for (var iio in layer.plates) { //+++
			  var mod = layer.plates[iio];
			  mod.material = mod.mat.rollOverMaterial;
			}
		    };

    }  /*else if (a_obj.parent == this.m_editor.main_frames) {
      var positions = this.m_editor.get_symmetry_positions_hex_half(
			to_hex_half(a_obj.position)); //+++ step = 15/2
      var poslen = positions.length;
      var getobj = function(apos, aobj){
			return editor.ship.frame_main[main_frame_zindex(apos.pos.x, apos.pos.y, apos.pos.z)];
		   };
    }*/


    for (var i = 0; i < poslen; ++i) {
      var iobj = getobj(positions[i], a_obj);
      if (!iobj) continue;
//alert("+++ sel i="+i+" obj "+iobj.index);
      this.m_editor.set_premodify(iobj, "mod"); 
      setroll(iobj);
    }

    this.m_selected_mesh = null;
  };

  this.update = function(ray) {
    var intersector = intersect(ray,[this.m_editor.sec_frames, this.m_editor.modules, this.m_editor.shilds]); //this.m_editor.main_frames,
    if (intersector) {
      var interobj = intersector.object;
      if (this.m_selected_mesh) {
       if (interobj != this.m_selected_mesh) {
	this.m_selected_mesh.material = this.m_selected_mesh.mat.mainMaterial;
	if ((this.m_editor.isShiftDown) && (interobj.material == interobj.mat.mainMaterial)) {
          this.m_selected_mesh = interobj;
          this.m_selected_mesh.material = this.m_selected_mesh.mat.rollOverMaterial;
	} else {
          this.m_selected_mesh = null;
	}
       } else if (!this.m_editor.isShiftDown) {
	   this.m_selected_mesh.material = this.m_selected_mesh.mat.mainMaterial;
         } else
	   this.m_selected_mesh.material = this.m_selected_mesh.mat.rollOverMaterial;
      } else {
	if ((this.m_editor.isShiftDown) && (interobj.material == interobj.mat.mainMaterial)) {
          this.m_selected_mesh = interobj;
          this.m_selected_mesh.material = this.m_selected_mesh.mat.rollOverMaterial;
	}
      }
    } else {
      if (this.m_selected_mesh) {
	  this.m_selected_mesh.material = this.m_selected_mesh.mat.mainMaterial;
          this.m_selected_mesh = null;
      }
    }

    if ( this.m_editor.isModify ) {

//      if (!this.m_editor.prev_pos.length) return;
/*      this.m_editor.ModifyModule(this.m_selected_mesh);*/

	var tmp;
	var ModeDir = 1;
        switch (this.m_editor.isModeModify) {
          case -1: { return; }
          case 7: {if (this.m_editor.isAccuracy) ModeDir = 0.01;}
          case 1: {
            if (this.m_editor.isModeModify == 1) ModeDir = -1;
            if (this.m_editor.isAccuracy) ModeDir = -0.01;
	    for (var i_obj in this.m_editor.prev_pos) {
	      var msh = this.m_editor.in_premodify(i_obj).parentUndo;
	      if (msh == undefined) continue;

	      if (msh.parent == this.m_editor.modules) { //Modules
	        msh.position.x += ModeDir*stepz;
	      }
            }
	    break;
          }
          case 4: 
          case 6: {if (this.m_editor.isModeModify == 6) ModeDir = -1;

//common checks. change pos to objects and borders
    	 for (var i_obj in this.m_editor.prev_pos) {
	  var msh = this.m_editor.in_premodify(i_obj).parentUndo;
	  if (msh == undefined) continue;
	  if (msh.parent == this.m_editor.modules) {
//Modules
	    if (ModeDir*msh.position.z >=  1000)  {this.m_editor.isModeModify = -1; return;} // if (tmp.z >=  1000)  {this.m_editor.isModeModify = -1; return;}
	    tmp = pos_by_index(msh.index);
    	    if (this.m_editor.isAccuracy) {
	      if ( !((Math.round((msh.position.z - tmp.z*stepz)*100)/100 * ModeDir) < (_halfstep - _accuracy_step)) ) 
	        {this.m_editor.isModeModify = -1; return;} //pos around on _halfstep = 2.5 m
    	    } else {
//	      tmp = to_hex_half(msh.position);
//	     if (msh.position.z == from_hex_half(tmp).z)
	      tmp.z += ModeDir/_poshalf;
	      tmp = module_index(msh.mod, tmp, angle_Z_by_index(msh.index));
	      if (this.m_editor.module_by_index(tmp)) {this.m_editor.isModeModify = -1; return;}
    	    }	    
	  } else if (msh.parent == this.m_editor.shilds) {
//Shields
	      var t_layer = msh.layer; 
	      //check only shield set
	      if ((ModeDir*t_layer >= 100)
	        || (this.m_editor.ship.shilds[t_layer + ModeDir] != undefined))
		{this.m_editor.isModeModify = -1; return;}
	  } else if (msh.parent == this.m_editor.sec_frames) {
//Sec Frames
	      var start_pos = {}; var end_pos = {};
	      this.m_editor.sec_pos_by_index(msh.index, start_pos, end_pos);
	      if ((ModeDir*start_pos.z >=  100) || (ModeDir*end_pos.z >=  100))  {this.m_editor.isModeModify = -1; return;}

	      start_pos.z += (ModeDir/_poshalf);  end_pos.z += (ModeDir/_poshalf);

	      if ((this.m_editor.ship.frame_sec[sec_frame_index(start_pos, end_pos)])
		|| (this.m_editor.ship.frame_sec[sec_frame_index(end_pos,start_pos)]))
	        {this.m_editor.isModeModify = -1; return;}
	  }
	 }
//common checks. 

    for (var i_obj in this.m_editor.prev_pos) {
    var msh = this.m_editor.in_premodify(i_obj).parentUndo;
    if (msh == undefined) continue;

	    if (msh.parent == this.m_editor.modules) {
//Modules
    //update  
	      if (this.m_editor.isAccuracy) {
	        msh.position.z = Math.round((msh.position.z + ModeDir*_accuracy_step)*100)/100; 
	      } else {
	        tmp = from_hex_half(pos_by_index(msh.index));
	        msh.position.z = tmp.z + ModeDir*stepz/_poshalf; //	        msh.position.z += ModeDir*stepz/_poshalf;
    // reindex
	        delete this.m_editor.ship.modules[msh.index];
	        tmp = module_index(msh.mod, to_hex_half(msh.position), angle_Z_by_index(msh.index));
	        msh.index = tmp;
	        this.m_editor.ship.modules[tmp] = msh;
	      }
	      msh.updateMatrix();

	    } else if (msh.parent == this.m_editor.shilds) {
//Shields
	      var t_layer = msh.layer; 
	      tmp = this.m_editor.ship.shilds[t_layer];
	      this.m_editor.ship.shilds[t_layer] = undefined;
	      t_layer = t_layer + ModeDir;
	      this.m_editor.ship.shilds[t_layer] = tmp;
	      for (var ii in tmp.plates) {
	        var tobj = tmp.plates[ii];
	        if (tobj != undefined) {
	          tobj.matrix = this.m_editor.get_shild_trans_matrix(tobj.tri_pos, t_layer);
	          tobj.layer = t_layer;
		  tobj.tri_pos.z = t_layer;
	        }
	      }
	      for (var ii in tmp.frames) {
	        var tobj = tmp.frames[ii];
	        if (tobj != undefined) {
	          tobj.matrix = this.m_editor.get_shild_frame_trans_matrix(ii, t_layer);
	        }
	      }
	      $("#slider_grid").slider("value",this.m_editor.get_layer()*10); //+++ slid

	    } else if (msh.parent == this.m_editor.sec_frames) {
//Sec Frames

	      this.m_editor.sec_pos_by_index(msh.index, start_pos, end_pos);
	      var oldind = sec_frame_index(start_pos, end_pos);
	      var secfr = this.m_editor.ship.frame_sec[oldind];
	      if (! secfr) {
	        var oldind = sec_frame_index(end_pos, start_pos);
	        var secfr = this.m_editor.ship.frame_sec[oldind];
	        if (! secfr) continue;
	        itmp = start_pos.clone(); start_pos = end_pos; end_pos = itmp.clone();
	      } 
	      start_pos.z += (ModeDir/_poshalf);  end_pos.z += (ModeDir/_poshalf);
	      tmp = sec_frame_index(start_pos, end_pos);

	      start_pos = from_hex_half(start_pos); //+++ step = 15/2
	      end_pos = from_hex_half(end_pos); //+++ step = 15/2
	      delete this.m_editor.ship.frame_sec[oldind];

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
		  avox.index = tmp;
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
		 avox.index = tmp;
		}
	      }
	      this.m_editor.ship.frame_sec[tmp] = secfr;
	    }
    };
	    break;
	  }
          case 11: //+  //+++ sca
          case 10: { //-  //+++ sca
	    if (this.m_editor.isModeModify == 10) ModeDir = -1;
	//no common checks. change to Min and Max scale any objects
	    for (var i_obj in this.m_editor.prev_pos) {
		var msh = this.m_editor.in_premodify(i_obj).parentUndo;
		if (msh == undefined) continue;
		if (msh.parent != this.m_editor.modules) continue;
	        var m_varsize = modules[msh.mod].varsize;
	        if (! m_varsize) continue;
	      tmp = chek_arr(m_varsize, function(i, vol){if (vol >= msh.scale.z) return i; else return undefined;});
	      if (tmp != undefined) {
		//check one obj
	        tmp = (ModeDir >0) ? 
		    m_varsize[(tmp < (m_varsize.length-1)) ? ++tmp : tmp] 
		  : m_varsize[(tmp > 0) ? --tmp : tmp];

	        if (tmp.length) {
    	    // reindex
	          var m_ind = msh.index;

	          this.m_editor.modules.remove(this.m_editor.ship.modules[m_ind]);
	          delete this.m_editor.ship.modules[m_ind];
	          var ttt = this.m_editor.add_module(tmp, to_hex_half(msh.position), angle_Z_by_index(m_ind), msh.posrota);
		  this.m_editor.set_premodify(ttt, msh); //change from prev_pos msh on ttt
		  ttt.material = ttt.mat.rollOverMaterial;
		  msh = null;
	        } else {
	          msh.scale.set(tmp, tmp, tmp);
	          msh.updateMatrix();
	        }
	      }
	    }
	    break;
	  }
          case 5: {
	    for (var i_obj in this.m_editor.prev_pos) {
		var msh = this.m_editor.in_premodify(i_obj).parentUndo;
		if (msh == undefined) continue;
		if (msh.parent == this.m_editor.modules) {
		  msh.posrota = rot_next(msh.rotation);
		  msh.updateMatrix();
		} else if (msh.parent == this.m_editor.sec_frames) {

/*		  var start_pos = {}; var end_pos = {};
		  this.m_editor.sec_pos_by_index(msh.index, start_pos, end_pos);
		  var oldind = sec_frame_index(start_pos, end_pos);
		  var secfr = this.m_editor.ship.frame_sec[oldind];
		  if (! secfr) {
			var oldind = sec_frame_index(end_pos, start_pos);
			var secfr = this.m_editor.ship.frame_sec[oldind];
			if (! secfr) continue;
			itmp = start_pos.clone(); start_pos = end_pos; end_pos = itmp.clone();
		  }
		  start_pos = from_hex_half(start_pos); //+++ step = 15/2
		  end_pos = from_hex_half(end_pos); //+++ step = 15/2
*/
/*		  var secfr = this.m_editor.ship.frame_sec[msh.index];
 //alert("rot! index="+msh.index);
		  for(var itmp = 0; itmp < secfr.length; itmp++) {
		    avox = secfr[itmp];
		    //avox.rotation.z += Math.PI/2;
 //alert(itmp+" rot! rot.Z="+avox.rotation.z+" X="+ avox.rotation.x+" Y="+ avox.rotation.y
		    +"\n pos.Z="+avox.position.z+" X="+ avox.position.x+" Y="+ avox.position.y);
		    //avox.updateMatrix();
		    
		  }*/
		}
	    };
	    break;
	  }
          case 0: { 
	    this.m_editor.ret_premodify();

/* //this.m_editor.get_prev_matrix(this.m_selected_mesh.matrix);
            tmp = this.m_editor.prev_matrix.decompose();
///this.m_selected_mesh.matrix.compose(tmp[0],tmp[1],tmp[2]);
	    this.m_selected_mesh.position.copy(tmp[0]); //setPositionFromMatrix(this.m_editor.prev_matrix);
//	    this.m_selected_mesh.rotation.set(0,0,0); //angle_Z_by_index(this.m_selected_mesh.index));
//	    this.m_selected_mesh.rotation.copy(tmp[1]); //matrix.setRotationFromEuler(tmp[1],this.m_selected_mesh.eulerOrder); //matrix.setRotationFromQuaternion
	    this.m_selected_mesh.scale.copy(tmp[2]);
*/
	    break;
	  }
        }
      this.m_editor.isModeModify = -1;
    } 
  };

/*// no work?!
  ModifyModule = function(a_mode) {
    return;
  }*/
}
ModifyContext.prototype = new BaseContext();
ModifyContext.prototype.constructor = ModifyContext; 
