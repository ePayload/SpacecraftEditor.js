function hex2circ(x, y) {
  var tan30 = (sin30 / cos30);
  var ax = Math.abs(x);
  var ay = Math.abs(y);
  var tan = Math.atan2(ay, ax);
  var r_t = (tan > (tan30 - 0.05)) ? (ax * tan30 + ay) : (ax / cos30);
  var r = Math.sqrt(x * x + y * y);
  var c = 1;
  if (r > 0) {
    c = r_t / r;
  }
  return c;
}

function circ2hex(x, y) {
  var tan30 = (sin30 / cos30);
  var ax = Math.abs(x);
  var ay = Math.abs(y);
  var tan = Math.atan2(ay, ax);
  var r_c = Math.sqrt(x * x + y * y);
  var c = 1;
  if (tan > (tan30 - 0.05)) {
    c = r_c * cos30 / (ax * sin30 + ay * cos30);
  } else {
    c = r_c * cos30 / ax;
  }
  return c;
}

THREE.TriangleGeometry = function ( width, depth, segmentsWidth, segmentsDepth, circle ) {

	THREE.Geometry.call( this );

	var ix, iz,
	width_half = width / 2,
	depth_half = depth / 2,
	gridX = segmentsWidth || 1,
	gridZ = segmentsDepth || 1,
	gridX1 = gridX + 1,
	gridZ1 = gridZ + 1,
	segment_width = width / gridX,
	segment_depth = depth / gridZ,
	normal = new THREE.Vector3( 0, 0, 1 );

	for ( iz = 0; iz < gridZ1; iz ++ ) {

		for ( ix = 0; ix < gridX1; ix ++ ) {

			var z = (ix + (iz & 1) * Math.cos(Math.PI * 60. / 180)) * segment_width - width_half;
			var x = (iz * segment_depth - depth_half) * Math.sin(Math.PI * 60. / 180);

      if (circle) {
        var c = hex2circ(x, z);
        x *= c;
        z *= c;
        
        /*c = circ2hex(x, z);
        x *= c;
        z *= c;*/
      }

			this.vertices.push( new THREE.Vector3( x, z, 0 ) );

		}

	}

	for ( iz = 0; iz < gridZ; iz ++ ) {

		for ( ix = 0; ix < gridX; ix ++ ) {

			var a = ix + gridX1 * iz;
			var b = ix + gridX1 * ( iz + 1 );
			var c = ( ix + 1 ) + gridX1 * ( iz + 1 );
			var d = ( ix + 1 ) + gridX1 * iz;

			var face;
			var face2;
			if (iz & 1) {
  			face = new THREE.Face3(a, b, c);
	  		face2 = new THREE.Face3(c, d, a);
			} else {
			  face = new THREE.Face3(d, a, b);
			  face2 = new THREE.Face3(b, c, d);
	    }
			face.normal.copy( normal );
			face.vertexNormals.push( normal.clone(), normal.clone(), normal.clone(), normal.clone() );

			face2.normal.copy( normal );
			face2.vertexNormals.push( normal.clone(), normal.clone(), normal.clone(), normal.clone() );

			this.faces.push(face);
			this.faces.push(face2);
			this.faceVertexUvs[0].push( [
				new THREE.UV( ix / gridX, iz / gridZ ),
				new THREE.UV( ix / gridX, ( iz + 1 ) / gridZ ),
				new THREE.UV( ( ix + 1 ) / gridX, ( iz + 1 ) / gridZ )
			] );

			this.faceVertexUvs[0].push( [
				new THREE.UV( ( ix + 1 ) / gridX, ( iz + 1 ) / gridZ ),
				new THREE.UV( ( ix + 1 ) / gridX, iz / gridZ ),
				new THREE.UV( ix / gridX, iz / gridZ )
			] );
		}

	}

	this.computeCentroids();

};

THREE.TriangleGeometry.prototype = new THREE.Geometry();
THREE.TriangleGeometry.prototype.constructor = THREE.TriangleGeometry;
