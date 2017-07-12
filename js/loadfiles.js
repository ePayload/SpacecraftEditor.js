
function make_timer(a_fun){
  var state = -1;
  this.MaxTime = 50;
  this.CallBack = a_fun; //function(){};
  this.Stop = function(){state = 1};
  this.message = "Timeout error";
  setTimeout(function arun() {
    if (state == 0) {
      this.CallBack();
    } else if (state > -this.MaxTime) {
      state--;
      setTimeout(arun, 100);
    } else alert(this.message);
  },100); 
}

function name_file(a_val){
   var b = a_val.lastIndexOf(".");
   var a = a_val.lastIndexOf("\\");
   a = (a >= 0) ? a : a_val.lastIndexOf("/");
return  a_val.slice((a >= 0) ? a+1 : 0 , (b > 0) ? b : a_val.length)
}

/*
function isType(o) {
    return Object.prototype.toString.call(o);
}
*/

function ObjPropNames(a_obj){
 var arre = [];
 for (var k in a_obj) arre.push(k);
 return arre;
}

function load_json(a_val, a_func, err_func) {
   var fr = new FileReader();
   var st_json = {};
   fr.onload = function(e) {
      try {
	  st_json = JSON.parse(e.target.result);
	  if (st_json.version > 3) {
	    throw 'Unsupported version';
	  };
	a_func(st_json);
      } catch (e) {
        window.alert('Cannot parse file: '+e.toString());
	if (err_func) err_func(e);
      }
   };
   fr.readAsText(a_val);
}

function load_js(a_val, a_func, err_func) {
//  this.callback = a_func;
//  this.loadjs = function () {
    var scriptJS = document.createElement("script");
//    var m_id = name_file(a_val);
//    scriptJS.id = m_id;
    scriptJS.src = a_val;
    scriptJS.type = "text/javascript";
    scriptJS.onload = function() {
	this.onload = this.onerror = null;
	a_func(a_val);
    }
    scriptJS.onerror = function(e) {
	this.onload = this.onerror = null;
	window.alert( "Error load JS in \n" + this.src);
	if (err_func) err_func(e);
    };

    //Load js
    document.head.appendChild(scriptJS);  //document.body.
  
//  };  return this.loadjs;
}

//+++ lib
function load_library(lib_path) {
  var nlib = name_file(lib_path);
  editor.set_prev_context(); //+++

  load_js(lib_path, function(a){	//load_js_lib(files[0].name, function(a){
		  delete materials['default'];			//Check 'default'
		  library.set_library(nlib);
		  library.popush();
		  
		  editor.create_materials();
		  editor.load_models();
		  editor.clear(); //editor.add_placeholders();
		  alert('Library added \'' + a + ' \'');
  });
}

function load_ship_store(ship_file) {
	
    var readed_json = -1;
    var json_store = {};
    var t_sc_editor = name_file(ship_file.name) + ' - ' + TitleEditor; //+++
    editor.set_prev_context(); //+++
    
    load_json(ship_file, function(json_st){
  	    json_store = json_st;
	    readed_json = 4;

    });

    editor.clear();
    var list_lib = false;

    setTimeout(function arun() {
	  if (readed_json == 0) {

    	    if (!json_store.library) {
    	      list_lib = [];
    	    } else {
	      if (!list_lib) {
	        list_lib = ('lib/'+json_store.library.join('.js,lib/')+'.js').split(",");
	      }
	      if (list_lib.length > 0) {
	        readed_json = -1;
		var a_lib = list_lib.shift();
		var nlib = name_file(a_lib);
		load_js(a_lib, function(a){
		  delete materials["default"];			//Check "default"
		  library.set_library(nlib);
		  library.popush();
		  readed_json = 4;
		  if (list_lib.length == 0) {
		    editor.create_materials();
		    editor.load_models();
		    //editor.add_placeholders();
		  }
		});
	      }
	    }
	  }

	  if (readed_json == 0) {
	    if (list_lib && list_lib.length == 0){
	      editor.clear(); //editor.add_placeholders();
	      editor.json2ship(json_store);
	      $('title').text(t_sc_editor); //+++
	    }
	  } else if (readed_json > -50) {
	    readed_json--;
	    setTimeout(arun, 100);
	  } else {
	    window.alert("Timeout read ship \n"+ship_file.name); 
	    readed_json = 0;
	    setTimeout(arun, 100);
	  }
    },100); 
  }

function library_engine() {
  var modules_parts = {
    materials : $.extend({}, materials),
    main_frames : $.extend({}, main_frames),
    sec_frames : $.extend({}, sec_frames),
    shields : $.extend({}, shields),
    modules : $.extend({}, modules),
    modules_cat : $.extend({}, modules_cat)
    };

  // First popush
  var push = {
    materials : $.extend({}, materials),
    main_frames : $.extend({}, main_frames),
    sec_frames : $.extend({}, sec_frames),
    shields : $.extend({}, shields),
    modules : $.extend({}, modules),
    modules_cat : $.extend({}, modules_cat)
    };

  _thislib = this;
  this.list = [];
  
  this.popush = function(){
    materials = $.extend(push.materials, materials);
    main_frames = $.extend(push.main_frames, main_frames);
    sec_frames = $.extend(push.sec_frames, sec_frames);
    shields = $.extend(push.shields, shields);
    modules = $.extend(push.modules, modules);
    modules_cat = $.extend(push.modules_cat, modules_cat);

    push.materials = $.extend({}, materials);
    push.main_frames = $.extend({}, main_frames);
    push.sec_frames = $.extend({}, sec_frames);
    push.shields = $.extend({}, shields);
    push.modules = $.extend({}, modules);
    push.modules_cat = $.extend({}, modules_cat);
  }

  this.reset = function (){
    _thislib.list = [];
    materials = $.extend({}, modules_parts.materials);
    main_frames = $.extend({}, modules_parts.main_frames);
    sec_frames = $.extend({}, modules_parts.sec_frames);
    shields = $.extend({}, modules_parts.shields);
    modules = $.extend({}, modules_parts.modules);
    modules_cat = $.extend({}, modules_parts.modules_cat);
  }

  this.set_library = function (a_name){ //add
    if (a_name != "modules") {
	var i = _thislib.list.indexOf(a_name);
	if (i >= 0) _thislib.list.splice(i,1);
	_thislib.list.push(a_name);
    }
//  for (var m in materials) {materials[m].lib_name = a_name};
    for (var m in main_frames) {main_frames[m].lib_name = a_name};
    for (var m in sec_frames) {sec_frames[m].lib_name = a_name};
    for (var m in shields) {shields[m].lib_name = a_name};
    for (var m in modules) {modules[m].lib_name = a_name};
//  for (var m in modules_cat) {modules_cat[m].lib_name = a_name};
  }




  this.set_library("modules");
}
//+++ lib

