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
      var pos = to_hex(intersector.point);
      var len = this.m_len * (intersector.face.normal.z < 0 ? -1 : 1);
      if (intersector.face.normal.z != 0) {
        var positions = this.m_editor.get_symmetry_positions_hex(pos);
        for (i in positions) {
          var pos = positions[i].pos;
          this.m_editor.add_main_frame(pos.x, pos.y, pos.z, len, this.m_module);
        }
        this.m_editor.update();
      }
    }
  };

  this.update = function(ray) {
    var intersector = intersect(ray,
      [this.m_editor.main_frames, this.m_editor.scene]);

    if (intersector != null) {
      var pos = snap(intersector.point);
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
    this.m_roll_over_mesh = this.m_roll_overs[this.m_module];
    if (this.m_roll_over_mesh != undefined) {
      this.m_roll_over_mesh.visible = true;
    }
  }
      
  this.mouse_down = function(ray) {
    if (this.m_roll_over_mesh.visible) {
      var positions = this.m_editor.get_symmetry_positions_hex(
        to_hex(this.m_roll_over_mesh.position), angle_to_hex(this.m_roll_over_mesh.rotation.z)
      );
      for (i in positions) {
        if (this.m_editor.add_module(this.m_module, positions[i].pos, positions[i].a)) {
          var module = modules[this.m_module];
          var rot_mat = new THREE.Matrix4();
          rot_mat.rotateZ(angle_from_hex(positions[i].a));
          for (var j = 0; j < module.attachment.length; ++j) {
            var pos = from_hex(positions[i].pos);
            var delta_pos = new THREE.Vector3(module.attachment[j][0], module.attachment[j][1], module.attachment[j][2]);
            delta_pos = from_hex(delta_pos);
            delta_pos = rot_mat.multiplyVector3(delta_pos);
            pos.subSelf(delta_pos);
            var hex_pos = to_hex(pos);
            this.m_editor.add_main_frame(hex_pos.x, hex_pos.y, hex_pos.z, 1, "main_frame_base");
          }
        }
      }
      this.m_editor.update();
      //this.m_editor.add_module(this.m_module, this.m_roll_over_mesh.position, this.m_roll_over_mesh.rotation.z);
    }
    /*var intersector = intersect(ray,
      [this.m_editor.main_frames, this.m_editor.scene]);
    if (intersector != null) {
      var pos = to_hex(intersector.point);
      /*var len = this.m_len * (intersector.face.normal.z < 0 ? -1 : 1);
      if (intersector.face.normal.z != 0) {
        var positions = this.m_editor.get_symmetry_positions_hex(pos);
        for (i in positions) {
          var pos = positions[i].pos;
          this.m_editor.add_main_frame(pos.x, pos.y, pos.z, len);
        }
      }*
    }*/
  };

  this.update = function(ray) {
    if (this.m_roll_over_mesh != undefined) {
      var intersector = intersect(ray,
        [this.m_editor.main_frames, this.m_editor.scene]);

      if (intersector != null) {
        var pos = snap(intersector.point);
        var attach_angle = 0;
        var angle = snap_vector_to_angle(intersector.face.normal);
        var angle_hex = angle_to_hex(angle);
        
        // Snap to main frames
        if (intersector.object.parent == this.m_editor.main_frames) {
          module = modules[this.m_module];
          var best_attachment = module.attachment[0];
          for (var i = 1; i < module.attachment.length; ++i) {
            if (module.attachment[i][3] == angle_hex) {
              best_attachment = module.attachment[i];
              break;
            }
          }
          attach_angle = angle_from_hex(best_attachment[3]) - angle;
          var rot_mat = new THREE.Matrix4();
          rot_mat.rotateZ(attach_angle);
          var delta_pos = new THREE.Vector3(best_attachment[0], best_attachment[1], 0);
          delta_pos = from_hex(delta_pos);
          delta_pos = rot_mat.multiplyVector3(delta_pos);
          pos.addSelf(delta_pos);
        }
        /*if (intersector.face.normal.z != 0) {
          pos.z += (this.m_len - 1) / 2 * stepz * 
            (intersector.face.normal.z < 0 ? -1 : 1);
          this.m_roll_over_mesh.visible = true;
        } else {
          this.m_roll_over_mesh.visible = false;
        }*/
        this.m_roll_over_mesh.position = pos;
        this.m_roll_over_mesh.rotation.z = attach_angle;// + Math.PI;
        this.m_roll_over_mesh.visible = true;
      } else {
        this.m_roll_over_mesh.visible = false;
      }
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
  }
  
  this.mouse_down = function(ray) {
    if (this.m_roll_over_mesh != undefined) {
      var intersector = intersect(ray,
        [this.m_editor.main_frames]);

      if (intersector != null &&
          intersector.face.normal.z == 0) {
        this.m_start_pos = to_hex(intersector.point);
      }
    }
  };

  this.mouse_up = function(ray) {
    if (this.m_start_pos != undefined && 
        this.m_end_pos != undefined &&
        this.m_roll_over_mesh.visible) {
      var start_positions = this.m_editor.get_symmetry_positions_hex(this.m_start_pos);
      var end_positions = this.m_editor.get_symmetry_positions_hex(this.m_end_pos);
      if (start_positions.length == 1) {
        for (var i = 0; i < end_positions.length; ++i) {
          editor.add_sec_frame(start_positions[0].pos, end_positions[i].pos, this.m_module);
        }
      } else if (end_positions.length == 1) {
        for (var i = 0; i < start_positions.length; ++i) {
          editor.add_sec_frame(start_positions[i].pos, end_positions[0].pos, this.m_module);
        }
      } else {
        for (var i = 0; i < end_positions.length; ++i) {
          editor.add_sec_frame(start_positions[i].pos, end_positions[i].pos, this.m_module);
        }
      }
      this.m_editor.update();
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
        [this.m_editor.main_frames]);

      if (intersector != null && 
          intersector.face.normal.z == 0) {
        this.m_end_pos = to_hex(intersector.point);
        if ((this.m_end_pos.x != this.m_start_pos.x) || 
            (this.m_end_pos.y != this.m_start_pos.y)) {
          this.m_roll_over_mesh.visible = true;
          var m = this.m_roll_over_mesh.matrix;
          
          var start_pos = from_hex(this.m_start_pos);
          var end_pos = from_hex(this.m_end_pos);
          
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
        this.m_editor.add_shild(pos_tri, this.m_module);
      }
      this.m_editor.update();
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
      this.m_editor.delete_object(this.m_selected_mesh);
      this.m_selected_mesh = null;
      this.m_editor.update();
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
      this.m_selected_mesh.material = this.m_selected_mesh.mat.selected_material;
    }
  };
}

DeleteContext.prototype = new BaseContext();
DeleteContext.prototype.constructor = DeleteContext;
