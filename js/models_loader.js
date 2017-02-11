ModelsLoader = function(a_onload) {
  // Callback on load all modules
  this.m_onload = a_onload;
  // Models array
  this.m_models = [];
  // OBJ loader
  this.m_loader = new THREE.OBJLoader();

  // Load model async
  this.load = function(a_name, a_url) {
    var _this = this;
    this.m_models[a_name] = null;
    this.m_loader.load(a_url, function(object) {
      var mesh_geo = object.children[0].geometry;
      
      mesh_geo.splitByUV = geometry_splitByUV;
      mesh_geo.splitByUV();
      mesh_geo.computeTangents();
      mesh_geo.computeFaceNormals();
      
      _this.m_models[a_name] = mesh_geo;
      
      _this._check_loaded();
    });
  }
  
  // Get loaded model by name
  this.model = function(a_name) {
    return this.m_models[a_name];
  }
  
  // Checks are all models loaded
  this._check_loaded = function () {
    for (name in this.m_models) {
      if (this.m_models[name] == null) {
        return;
      }
    }
    this.m_onload();
  }
}

TextureManager = function(a_onload) {
  // Callback on load all textures
  this.m_onload = a_onload;
  this.m_textures = {};
  this.m_pending_loading = 0;
  this.get_texture = function(a_url) {
    if (this.m_textures[a_url] == undefined) {
      ++this.m_pending_loading;
      var _this = this;
      this.m_textures[a_url] = THREE.ImageUtils.loadTexture(a_url, {}, function(){
        --_this.m_pending_loading;
        if (_this.m_pending_loading == 0) {
          _this.m_onload();
        }
      });
    }
    return this.m_textures[a_url];
  }
}
