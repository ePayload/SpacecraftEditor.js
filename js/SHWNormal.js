THREE.ShaderUtils.lib['SHWnormal'] = {

  uniforms: THREE.UniformsUtils.merge([

				THREE.UniformsLib["fog"],
				THREE.UniformsLib["lights"],
				THREE.UniformsLib["shadowmap"],

				{

				  "enableAO": { type: "i", value: 0 },
				  "enableDiffuse": { type: "i", value: 0 },
				  "enableSpecular": { type: "i", value: 0 },
				  "enableReflection": { type: "i", value: 0 },
				  "enableSelIllumination": { type: "i", value: 0 },

				  "tDiffuse": { type: "t", value: 0, texture: null },
				  "tCube": { type: "t", value: 1, texture: null },
				  "tNormal": { type: "t", value: 2, texture: null },
				  "tSpecular": { type: "t", value: 3, texture: null },
				  "tAO": { type: "t", value: 4, texture: null },
				  "tDisplacement": { type: "t", value: 5, texture: null },
				  //"tSelfIllumination": { type: "t", value: 4, texture: null },

				  "uNormalScale": { type: "f", value: 1.0 },

				  "uDisplacementBias": { type: "f", value: 0.0 },
				  "uDisplacementScale": { type: "f", value: 1.0 },

				  /*"uDiffuseColor": { type: "c", value: new THREE.Color(0xffffff) },
				  "uSpecularColor": { type: "c", value: new THREE.Color(0x111111) },*/
				  "uDiffuseColor": { type: "v3", value: new THREE.Vector3(1, 1, 1) },
				  "uSpecularColor": { type: "v3", value: new THREE.Vector3(1, 1, 1) },
				  "uAmbientColor": { type: "c", value: new THREE.Color(0xffffff) },
				  "uShininess": { type: "f", value: 30 },
				  "uOpacity": { type: "f", value: 1 },

				  "uReflectivity": { type: "f", value: 0.5 },

				  "uOffset": { type: "v2", value: new THREE.Vector2(0, 0) },
				  "uRepeat": { type: "v2", value: new THREE.Vector2(1, 1) },

				  "wrapRGB": { type: "v3", value: new THREE.Vector3(1, 1, 1) }

				}

			]),

  fragmentShader: [

				"uniform vec3 uAmbientColor;",
				"uniform vec3 uDiffuseColor;",
				"uniform vec3 uSpecularColor;",
				"uniform float uShininess;",
				"uniform float uOpacity;",

				"uniform bool enableDiffuse;",
				"uniform bool enableSpecular;",
				"uniform bool enableAO;",
				"uniform bool enableReflection;",
				"uniform bool enableSelIllumination;",

				"uniform sampler2D tDiffuse;",
				"uniform sampler2D tNormal;",
				"uniform sampler2D tSpecular;",
				"uniform sampler2D tAO;",
				//"uniform sampler2D tSelfIllumination;",

				"uniform samplerCube tCube;",

				"uniform float uNormalScale;",
				"uniform float uReflectivity;",

				"varying vec3 vTangent;",
				"varying vec3 vBinormal;",
				"varying vec3 vNormal;",
				"varying vec2 vUv;",

				"uniform vec3 ambientLightColor;",

				"#if MAX_DIR_LIGHTS > 0",
					"uniform vec3 directionalLightColor[ MAX_DIR_LIGHTS ];",
					"uniform vec3 directionalLightDirection[ MAX_DIR_LIGHTS ];",
				"#endif",

				"#if MAX_POINT_LIGHTS > 0",
					"uniform vec3 pointLightColor[ MAX_POINT_LIGHTS ];",
					"varying vec4 vPointLight[ MAX_POINT_LIGHTS ];",
				"#endif",

				"#ifdef WRAP_AROUND",
					"uniform vec3 wrapRGB;",
				"#endif",

				"varying vec3 vViewPosition;",

				THREE.ShaderChunk["shadowmap_pars_fragment"],
				THREE.ShaderChunk["fog_pars_fragment"],

				"void main() {",

					"gl_FragColor = vec4( vec3( 1.0 ), uOpacity );",

					"vec3 specularTex = vec3( 1.0 );",
					"float shininessTex = uShininess;",

					"vec3 normalTex = texture2D( tNormal, vUv ).xyz * 2.0 - 1.0;",
					"normalTex.xy *= uNormalScale;",
					"normalTex = normalize( normalTex );",

					"if( enableDiffuse ) {",

						"#ifdef GAMMA_INPUT",

							"vec4 texelColor = texture2D( tDiffuse, vUv );",
							"texelColor.xyz *= texelColor.xyz;",

							"gl_FragColor = gl_FragColor * texelColor;",

						"#else",

							"gl_FragColor = gl_FragColor * texture2D( tDiffuse, vUv );",

						"#endif",

					"}",
					"if (gl_FragColor.a < 0.5) discard;",

					/*"if( enableAO ) {",

						"#ifdef GAMMA_INPUT",

							"vec4 aoColor = texture2D( tAO, vUv );",
							"aoColor.xyz *= aoColor.xyz;",

							"gl_FragColor.xyz = gl_FragColor.xyz * aoColor.xyz;",

						"#else",

							"gl_FragColor.xyz = gl_FragColor.xyz * texture2D( tAO, vUv ).xyz;",

						"#endif",

					"}",*/

					"if( enableSpecular ) {",
					  "vec4 tempTex = texture2D( tSpecular, vUv );",
						"specularTex = tempTex.xyz;",
  					"shininessTex = uShininess * tempTex.w + 1.0001;",
					"}",

					"mat3 tsb = mat3( normalize( vTangent ), normalize( vBinormal ), normalize( vNormal ) );",
					"vec3 finalNormal = tsb * normalTex;",

					"vec3 normal = normalize( finalNormal );",
					"vec3 viewPosition = normalize( vViewPosition );",

  // point lights

					"#if MAX_POINT_LIGHTS > 0",

						"vec3 pointDiffuse = vec3( 0.0 );",
						"vec3 pointSpecular = vec3( 0.0 );",

						"for ( int i = 0; i < MAX_POINT_LIGHTS; i ++ ) {",

							"vec3 pointVector = normalize( vPointLight[ i ].xyz );",
							"float pointDistance = vPointLight[ i ].w;",

  // diffuse

							"#ifdef WRAP_AROUND",

								"float pointDiffuseWeightFull = max( dot( normal, pointVector ), 0.0 );",
								"float pointDiffuseWeightHalf = max( 0.5 * dot( normal, pointVector ) + 0.5, 0.0 );",

								"vec3 pointDiffuseWeight = mix( vec3 ( pointDiffuseWeightFull ), vec3( pointDiffuseWeightHalf ), wrapRGB );",

							"#else",

								"float pointDiffuseWeight = max( dot( normal, pointVector ), 0.0 );",

							"#endif",

							"pointDiffuse += pointDistance * pointLightColor[ i ] * uDiffuseColor * pointDiffuseWeight;",

  // specular

							"vec3 pointHalfVector = normalize( pointVector + viewPosition );",
							"float pointDotNormalHalf = max( dot( normal, pointHalfVector ), 0.0 );",
							"float pointSpecularWeight = max( pow( pointDotNormalHalf, shininessTex ), 0.0 );", // specularTex.r * 

							"#ifdef PHYSICALLY_BASED_SHADING",

  // 2.0 => 2.0001 is hack to work around ANGLE bug

								"float specularNormalization = ( shininessTex + 2.0001 ) / 8.0;",

								"vec3 schlick = uSpecularColor + vec3( 1.0 - uSpecularColor ) * pow( 1.0 - dot( pointVector, pointHalfVector ), 5.0 );",
								"pointSpecular += schlick * specularTex * pointLightColor[ i ] * pointSpecularWeight * pointDiffuseWeight * pointDistance * specularNormalization;",

							"#else",

								"pointSpecular += pointDistance * pointLightColor[ i ] * uSpecularColor * specularTex * pointSpecularWeight * pointDiffuseWeight;",

							"#endif",

						"}",

					"#endif",

  // directional lights

					"#if MAX_DIR_LIGHTS > 0",

						"vec3 dirDiffuse = vec3( 0.0 );",
						"vec3 dirSpecular = vec3( 0.0 );",

						"for( int i = 0; i < MAX_DIR_LIGHTS; i++ ) {",

							"vec4 lDirection = viewMatrix * vec4( directionalLightDirection[ i ], 0.0 );",
							"vec3 dirVector = normalize( lDirection.xyz );",

  // diffuse

							"#ifdef WRAP_AROUND",

								"float directionalLightWeightingFull = max( dot( normal, dirVector ), 0.0 );",
								"float directionalLightWeightingHalf = max( 0.5 * dot( normal, dirVector ) + 0.5, 0.0 );",

								"vec3 dirDiffuseWeight = mix( vec3( directionalLightWeightingFull ), vec3( directionalLightWeightingHalf ), wrapRGB );",

							"#else",

								"float dirDiffuseWeight = max( dot( normal, dirVector ), 0.0 );",

							"#endif",

							"dirDiffuse += directionalLightColor[ i ] * uDiffuseColor * dirDiffuseWeight;",

  // specular

							"vec3 dirHalfVector = normalize( dirVector + viewPosition );",
							"float dirDotNormalHalf = max( dot( normal, dirHalfVector ), 0.0 );",
							"float dirSpecularWeight = max( pow( dirDotNormalHalf, shininessTex ), 0.0 );", // specularTex.r * 

							"#ifdef PHYSICALLY_BASED_SHADING",

  // 2.0 => 2.0001 is hack to work around ANGLE bug

								"float specularNormalization = ( shininessTex + 2.0001 ) / 8.0;",

								"vec3 schlick = uSpecularColor + vec3( 1.0 - uSpecularColor ) * pow( 1.0 - dot( dirVector, dirHalfVector ), 5.0 );",
								"dirSpecular += schlick * directionalLightColor[ i ] * specularTex * dirSpecularWeight * dirDiffuseWeight * specularNormalization;",

							"#else",

								"dirSpecular += directionalLightColor[ i ] * uSpecularColor * specularTex * dirSpecularWeight * dirDiffuseWeight;",

							"#endif",

						"}",

					"#endif",

  // all lights contribution summation

					"vec3 totalDiffuse = vec3( 0.0 );",
					"vec3 totalSpecular = vec3( 0.0 );",

					"#if MAX_DIR_LIGHTS > 0",

						"totalDiffuse += dirDiffuse;",
						"totalSpecular += dirSpecular;",

					"#endif",

					"#if MAX_POINT_LIGHTS > 0",

						"totalDiffuse += pointDiffuse;",
						"totalSpecular += pointSpecular;",

					"#endif",

          "vec3 ambient = gl_FragColor.xyz * ambientLightColor * uAmbientColor;",
					"gl_FragColor.xyz = gl_FragColor.xyz * ( totalDiffuse ) + totalSpecular;",

					THREE.ShaderChunk["shadowmap_fragment"],

					"gl_FragColor.xyz = gl_FragColor.xyz + ambient;",

					"if ( enableReflection ) {",

						"vec3 wPos = cameraPosition - vViewPosition;",
						"vec3 vReflect = reflect( normalize( wPos ), normal );",
						"float fBias =  10.0 * pow(0.97, shininessTex);",

						"vec4 cubeColor = textureCube( tCube, vec3( -vReflect.x, vReflect.yz ), fBias);",

						"#ifdef GAMMA_INPUT",

							"cubeColor.xyz *= cubeColor.xyz;",

						"#endif",

            //"gl_FragColor.xyz = mix( gl_FragColor.xyz, cubeColor.xyz  * specularTex, uReflectivity );", // specularTex.r *
						"gl_FragColor.xyz = gl_FragColor.xyz + cubeColor.xyz  * specularTex;", // specularTex.r * 

					"}",

          "if (enableSelIllumination) {",
            "gl_FragColor.xyz = gl_FragColor.xyz + texture2D(tAO, vUv).xyz;",
          "}",
					
					THREE.ShaderChunk["linear_to_gamma_fragment"],
					THREE.ShaderChunk["fog_fragment"],

				"}"

			].join("\n"),

  vertexShader: [

				"attribute vec4 tangent;",

				"uniform vec2 uOffset;",
				"uniform vec2 uRepeat;",

				"#ifdef VERTEX_TEXTURES",

					"uniform sampler2D tDisplacement;",
					"uniform float uDisplacementScale;",
					"uniform float uDisplacementBias;",

				"#endif",

				"varying vec3 vTangent;",
				"varying vec3 vBinormal;",
				"varying vec3 vNormal;",
				"varying vec2 vUv;",

				"#if MAX_POINT_LIGHTS > 0",

					"uniform vec3 pointLightPosition[ MAX_POINT_LIGHTS ];",
					"uniform float pointLightDistance[ MAX_POINT_LIGHTS ];",

					"varying vec4 vPointLight[ MAX_POINT_LIGHTS ];",

				"#endif",

				"varying vec3 vViewPosition;",

				THREE.ShaderChunk["shadowmap_pars_vertex"],

				"void main() {",

					"vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );",

					"vViewPosition = -mvPosition.xyz;",

  // normal, tangent and binormal vectors

					"vNormal = normalMatrix * normal;",
					"vTangent = normalMatrix * tangent.xyz;",
					"vBinormal = cross( vNormal, vTangent ) * tangent.w;",

					"vUv = uv * uRepeat + uOffset;",

  // point lights

					"#if MAX_POINT_LIGHTS > 0",

						"for( int i = 0; i < MAX_POINT_LIGHTS; i++ ) {",

							"vec4 lPosition = viewMatrix * vec4( pointLightPosition[ i ], 1.0 );",
							"vec3 lVector = lPosition.xyz - mvPosition.xyz;",

							"float lDistance = 1.0;",
							"if ( pointLightDistance[ i ] > 0.0 )",
								"lDistance = 1.0 - min( ( length( lVector ) / pointLightDistance[ i ] ), 1.0 );",

							"lVector = normalize( lVector );",

							"vPointLight[ i ] = vec4( lVector, lDistance );",

						"}",

					"#endif",

  // displacement mapping

					"#ifdef VERTEX_TEXTURES",

						"vec3 dv = texture2D( tDisplacement, uv ).xyz;",
						"float df = uDisplacementScale * dv.x + uDisplacementBias;",
						"vec4 displacedPosition = vec4( normalize( vNormal.xyz ) * df, 0.0 ) + mvPosition;",
						"gl_Position = projectionMatrix * displacedPosition;",

					"#else",

						"gl_Position = projectionMatrix * mvPosition;",

					"#endif",

					THREE.ShaderChunk["shadowmap_vertex"],

				"}"

			].join("\n")

};

function geometry_splitByUV() {

  // Explode polygons;
  var vertices = [];
  for (f = 0, fl = this.faces.length; f < fl; f++) {
    face = this.faces[f];
    var idx = f * 3;
    vertices[idx] = this.vertices[face.a].clone();
    vertices[idx + 1] = this.vertices[face.b].clone();
    vertices[idx + 2] = this.vertices[face.c].clone();
    face.a = idx;
    face.b = idx + 1;
    face.c = idx + 2;
  }
  this.vertices = vertices;

  // Merge again
  var verticesMap = {}; // Hashmap for looking up vertice by position coordinates (and making sure they are unique)
  var unique = [];//, changes = [];

  //var v, key;
  var precisionPoints = 4; // number of decimal points, eg. 4 for epsilon of 0.0001
  var precision = Math.pow(10, precisionPoints);
  //var i, il, face;
  //var abcd = 'abcd', o, k, j, jl, u;


  function hash_uv(a_uv) {
    return [Math.round(a_uv.u * precision), Math.round(a_uv.v * precision)].join('_');
  }

  function hash_v(a_v) {
    return [Math.round(a_v.x * precision), Math.round(a_v.y * precision), Math.round(a_v.z * precision)].join('_');
  }


  function add_vertex(a_v, a_normal, a_uv, a_uv2, a_uv3) {
    // Check mirrored UVs
    var du1 = a_uv2.u - a_uv.u;
    var du2 = a_uv3.u - a_uv.u;
    var dv1 = a_uv2.v - a_uv.v;
    var dv2 = a_uv3.v - a_uv.v;
    var uv_cross = du1 * dv2 - du2 * dv1;
    
    // Build key by position, normal, UV and UV direction: regular or mirrored
    var key = [hash_v(a_v), hash_v(a_normal), hash_uv(a_uv), uv_cross > 0 ? "r" : "m"].join('_');
    if (verticesMap[key] === undefined) {
      unique.push(a_v);
      verticesMap[key] = unique.length - 1;
      //changes[i] = unique.length - 1;
    } /*else { 
      //console.log('Duplicate vertex found. ', i, ' could be using ', verticesMap[key]);
      //changes[i] = changes[verticesMap[key]];
    }*/
    return verticesMap[key];
  }

  for (var f = 0; f < this.faces.length; ++f) {
    var face = this.faces[f];
    var uv = this.faceVertexUvs[0][f];

    face.a = add_vertex(this.vertices[face.a], face.vertexNormals[0], uv[0], uv[1], uv[2]);
    face.b = add_vertex(this.vertices[face.b], face.vertexNormals[1], uv[1], uv[2], uv[0]);
    face.c = add_vertex(this.vertices[face.c], face.vertexNormals[2], uv[2], uv[0], uv[1]);
  }

  // Use unique set of vertices
  this.vertices = unique;
}
