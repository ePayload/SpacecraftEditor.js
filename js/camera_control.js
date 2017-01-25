function CameraController(camera, engine) {
  STATE = {NONE: -1, ROTATE: 0, ZOOM: 1, PAN: 2};
  var _state = STATE.NONE;
  var _start = new THREE.Vector2();
  var _end = new THREE.Vector2();
  var _target = new THREE.Vector3();
  var _wheel = 0;

  this.onMouseDown = function (event) {
    function get_t(a0, da, t_min) {
      if (Math.abs(da) > 0.0001) {
        var t = -a0 / da;
        if (t < t_min && t > 1) {
          return t;
        }
      }
      return t_min;
    }
    function line_closest_approach(pa, ua, pb, ub) {
      var p = new THREE.Vector3();
      p.sub(pb, pa);
      var uaub = ua.dot(ub);
      var q1 = ua.dot(p);
      var q2 = -ub.dot(p);
      var d = 1 - uaub * uaub;
      if (d <= 0.0001) {
        return false;
      } else {
        d = 1 / d;
        return { a: (q1 + uaub * q2) * d, b: (uaub * q1 + q2) * d };
      }
    }

    if (_state == STATE.NONE) {
      switch (event.button) {
        case 1: _state = STATE.PAN; break;
        case 2:
          {
            _state = STATE.ROTATE;
            var dir = camera.matrixWorld.getColumnZ().clone().negate();
            var res = line_closest_approach(camera.position, dir, new THREE.Vector3(), new THREE.Vector3(0, 0, 1));
            var t = 2000;
            if (res !== false) {
              t = res.a;
            }
            if (t < 0 || t >= 2000) {
              var a = camera.position.clone().negate();
              t = dir.dot(a);
              //t = get_t(camera.position.z, dir.z, 1000);
            }
            /*var t = 1000;
            t = get_t(camera.position.x, dir.x, t);
            t = get_t(camera.position.y, dir.y, t);
            t = get_t(camera.position.z, dir.z, t);*/
            if (t < 0 || t >= 2000) {
              t = 1;
            }
            _target.add(camera.position, dir.multiplyScalar(t));

            break;
          }
      }
      _start.x = _end.x = event.clientX;
      _start.y = _end.y = event.clientY;
    }
  };
  this.onMouseUp = function(event) {
    _state = STATE.NONE;
  };
  this.onMouseWheel = function(event) {
	  // cross-browser wheel delta
	  var event = window.event || event;
	  _wheel += Math.max(-360, Math.min(360, (event.wheelDelta || -event.detail)));

    _state = STATE.ZOOM;
    /*console.log('delta ' + delta);
    _end.y = -delta * 0.3;
    _start.y = 0;*/
  };
  this.onMouseMove = function(event) {
    _end.x = event.clientX;
    _end.y = event.clientY;    
  };
  this.update = function() {
    switch (_state) {
      case STATE.ROTATE: {
        var mat = new THREE.Matrix4();
        mat.rotateY((_end.x - _start.x) * -0.01);
        var axis = (new THREE.Vector3(0, 1, 0)).crossSelf(camera.matrixWorld.getColumnZ());
        mat.rotateByAxis(axis, (_start.y - _end.y) * 0.01);
        //mat.rotateX((_start.y - _end.y) * 0.02);
        var _eye = camera.position.clone().subSelf(_target);
        mat.multiplyVector3(_eye);
        camera.position.add(_eye, _target);
        camera.lookAt(_target);
        
        break;
      }
      case STATE.PAN: {
        camera.position.addSelf(camera.matrixWorld.getColumnY().clone().multiplyScalar(_end.y - _start.y));
        camera.position.addSelf(camera.matrixWorld.getColumnX().clone().multiplyScalar(-_end.x + _start.x));
        break;
      }
      case STATE.ZOOM: {
      	//console.log('delta ' + _end.y + ' - ' + _start.y);
        camera.position.addSelf(camera.matrixWorld.getColumnZ().clone().multiplyScalar(-_wheel * 0.3));
        _wheel = 0;
        _state = STATE.NONE;
        break;
      }
    }
    _start.copy(_end);
  };
}
