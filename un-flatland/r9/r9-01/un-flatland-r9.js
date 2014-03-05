	var uf = uf || {};
/* 
console.log( 'kkkk')
	uf.lat = 37.796;
	uf.lon = -122.398;  // me
	uf.zoom = 10;
	uf.scaleVert = uf.zoom - 4;
	uf.camX = 800; uf.camY = 350; uf.camZ = 800;
	uf.tarX = 0; uf.tarY = 0; uf.tarZ = 0;

	uf.tilesPerSide = 5;
	uf.vertsPerTile = 32;
	uf.mapType = 5;
*/
	var varDefaults = [ 
		['zoom', 9, 0],
		['lat', 37.796, 1],
		['lon', -122.398, 2],
		['map', 5, 3],
		['tiles', 2, 4], 
		['verts',32, 5], 
		['camx',300, 6],
		['camy', 900, 7], 
		['camz', 600, 8], 
		['targetx', 0, 9], 
		['targety', 0, 10], 
		['targetz', 0, 11]	
];
	var varValues = varDefaults.slice();
	uf.mapTypes = [
		['Colorful',''],
		['Google Maps','http://mt1.google.com/vt/x='],
		['Google Maps Terrain','http://mt1.google.com/vt/lyrs=t&x='],
		['Google Maps Satellite','http://mt1.google.com/vt/lyrs=s&x='],
		['Google Maps Hybrid','http://mt1.google.com/vt/lyrs=y&x='],
		['Open Street Map','http://tile.openstreetmap.org/'],
		['Open Cycle Map', 'http://tile.opencyclemap.org/cycle/'],
		['MapQuest OSM', 'http://otile3.mqcdn.com/tiles/1.0.0/osm/'],
		['MapQuest Satellite', 'http://otile3.mqcdn.com/tiles/1.0.0/sat/'],
		['Stamen terrain background','http://tile.stamen.com/terrain-background/'],
		['HeightMap','../../../terrain/'],
		['Wireframe','']
	];
	uf.zoomScales = [ [0, 5],[1, 5],[2, 5],[3, 5],[4, 5],[5, 5],[6, 5],[7, 0.25],[8, 0.5],[9, 1],[10, 1.5],[11, 2],[12, 4],[13, 5],[14, 6],[15, 8],[16, 9],[17, 20],[18, 10],[19, 20],[20, 20],[21, 20],[22, 20] ];
	uf.tileSize = 256; // Three.js screen units

	uf.parsePermalink = function () {
		var item;
		var index;
		var hashes = location.hash.split('#');
		for (var i = 1, len = hashes.length; i < len; i++) {
			item = hashes[i].split('=');
			index = varIndex.indexOf( item[0] );
			if ( index > -1 ) {
				varValues[ index ] = item[1];
//console.log( item[1], varDefaults[3], place )
			}
		}
		uf.zoom = parseInt( varValues[0][1], 10 );
		uf.lat = parseFloat( varValues[1][1] );
		uf.lon = parseFloat( varValues[2][1] );
		uf.mapType = parseInt( varValues[3][1], 10);
		uf.tilesPerSide = parseInt( varValues[4][1], 10 );
		uf.vertsPerTile = parseInt( varValues[5][1], 10);

		uf.camX = parseFloat( varValues[6][1] );
		uf.camY = parseFloat( varValues[7][1] );
		uf.camZ = parseFloat( varValues[8][1] );

		uf.tarX = parseFloat( varValues[9][1] );
		uf.tarY = parseFloat( varValues[10][1] );
		uf.tarZ = parseFloat( varValues[11][1] );

	}

	uf.init = function() {

		uf.parsePermalink(); 

		uf.renderer = new THREE.WebGLRenderer( { alpha: 1, antiAlias: true, clearColor: 0xffffff } );
		uf.renderer.setSize( window.innerWidth, window.innerHeight );
		document.body.appendChild( uf.renderer.domElement );

		uf.scene = new THREE.Scene();

		uf.camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 20000 );
		uf.controls = new THREE.TrackballControls( uf.camera, uf.renderer.domElement );
		uf.setCamera();

		THREE.ImageUtils.crossOrigin = 'anonymous';

		uf.canvas = document.createElement( 'canvas' );
		uf.canvas.width = uf.canvas.height = uf.vertsPerTile;
		uf.context = uf.canvas.getContext( '2d' );

		uf.drawTerrain();
	}


	uf.drawCanvasImage = function( heightmaps, index, point7, latCur, lonCur, ii, jj ) {
		return function() {

			var mesh, geometry, material, texture; 
			var offset = -0.5 * uf.tileSize * uf.tilesPerSide; // Remember: Tiles are drawn from their centers

			var pointZoomWin = uf.getPoint( latCur, lonCur, uf.zoom );

			var zoomWinScale = Math.pow( 2, uf.zoom - 7);

			var cropSizeX = heightmaps[index].width / zoomWinScale;
			var cropSizeY = heightmaps[index].height / zoomWinScale;

			var deltaX = pointZoomWin.tileX - point7.tileX * zoomWinScale;
			var deltaY = pointZoomWin.tileY - point7.tileY * zoomWinScale;

			var cropStartX = cropSizeX * deltaX;
			var cropStartY = cropSizeY * deltaY;

			uf.context.drawImage( heightmaps[index], cropStartX - 2, cropStartY - 2, cropSizeX + 2, cropSizeY + 2, 0, 0, uf.vertsPerTile, uf.vertsPerTile);
			var imgData = uf.context.getImageData( 0, 0, uf.vertsPerTile, uf.vertsPerTile ).data;

			geometry = new THREE.PlaneGeometry( uf.tileSize, uf.tileSize, uf.vertsPerTile - 1, uf.vertsPerTile - 1);
 			geometry.applyMatrix( new THREE.Matrix4().makeRotationX( -0.5 * Math.PI ) );

			var verts = geometry.vertices;
			var scale = uf.zoomScales[ uf.zoom ][1];
			for ( var i = 0, j = 0, len = imgData.length; i < len; i += 4 ) {
				verts[j++].y = 1 + scale * imgData[i];
			}

			if ( uf.mapType < 1 ) {
				material = new THREE.MeshNormalMaterial( { shading: THREE.SmoothShading } );
			} else if ( uf.mapType < 5  ) {
				texture = THREE.ImageUtils.loadTexture( uf.mapTypes[ uf.mapType ][1] + pointZoomWin.tileX + "&y=" + pointZoomWin.tileY + "&z=" + uf.zoom  );
//				texture.needsUpdate = true;
				material = new THREE.MeshBasicMaterial( { map: texture } );
			} else if ( uf.mapType < 11) {
				texture = THREE.ImageUtils.loadTexture( uf.mapTypes[ uf.mapType ][1] + uf.zoom + "/" + pointZoomWin.tileX + "/" + pointZoomWin.tileY + ".png" );
//				texture.needsUpdate = true;
				material = new THREE.MeshBasicMaterial( { map: texture } );

			} else if ( uf.mapType < 12 ) {
				material = new THREE.MeshBasicMaterial( { color: 0x000000, wireframe: true } );
			}

			mesh = new THREE.Mesh( geometry, material );
			mesh.position.set( ii * uf.tileSize + offset + 0.5 * uf.tileSize, 0, jj * uf.tileSize + offset + 0.5 * uf.tileSize );
			uf.terrain.add( mesh );
		}
	}


	uf.drawTerrain = function() {
		if ( uf.terrain ) uf.scene.remove( uf.terrain );
		uf.terrain = new THREE.Object3D();
		var count = 0;
		var images = [];
		uf.start = Math.floor( 0.5 * ( uf.tilesPerSide - 1 ) );
		uf.offset =  -0.5 * uf.tileSize * uf.tilesPerSide; // Remember: Tiles are drawn from their centers

		uf.pointZoomWin = uf.getPoint( uf.lat, uf.lon, uf.zoom );
		uf.ulLat = uf.pointZoomWin.ulTileLat + uf.start * uf.pointZoomWin.deltaLat; // for add-ons
		uf.ulLon = uf.pointZoomWin.ulTileLon - uf.start * uf.pointZoomWin.deltaLon;

		var latStart = uf.lat + uf.start * uf.pointZoomWin.deltaLat;
		var lonStart = uf.lon - uf.start * uf.pointZoomWin.deltaLon;

		var lonCurrent, latCurrent, pointLevel7, xDir;
		for ( var i = 0; i < uf.tilesPerSide; i++ ) {
			lonCurrent = lonStart + i * uf.pointZoomWin.deltaLon;
			for ( var j = 0; j < uf.tilesPerSide; j++ ) {
				latCurrent = latStart - j * uf.pointZoomWin.deltaLat;
					pointLevel7 = uf.getPoint( latCurrent, lonCurrent, 7 );
					if ( pointLevel7.tileX < 32 ) {
						xDir = 'terrain-de3-0-31/';
					} else if ( pointLevel7.tileX < 64 ) {
						xDir = 'terrain-de3-32-63/';
					} else if ( pointLevel7.tileX < 96 ) {
						xDir = 'terrain-de3-64-95/';
					} else {
						xDir = 'terrain-de3-96-127/';
					}
				images[count] = document.createElement( 'img' );
				images[count].onload = uf.drawCanvasImage( images, count, pointLevel7, latCurrent, lonCurrent, i, j );
				images[count].src = '../../../../projects/' + xDir + pointLevel7.tileX + '/' + pointLevel7.tileY + '.png' ; 
				count++
			}
		} 
		uf.lrLat = latCurrent; // for add-ons
		uf.lrLon = lonCurrent;
		uf.scene.add( uf.terrain );
		uf.update = true;
	}

	uf.getPoint = function( latP, lonP, zoom ) {
		var tileX = lon2tile( lonP, zoom );
		var tileY = lat2tile( latP, zoom );

		var ulTileLat = tile2lat( tileY, zoom);  // ulTileLat ?
		var ulTileLon = tile2lon( tileX, zoom );

		var deltaLat = Math.abs( tile2lat( tileY, zoom ) - tile2lat( tileY + 1, zoom ));
		var deltaLon = Math.abs( tile2lon( tileX, zoom ) - tile2lon( tileX + 1, zoom ));

		var scaleX = 1 / deltaLon;
		var scaleY = 1 / deltaLat;

		var ptX = uf.tileSize * scaleX * ( lonP - ulTileLon);
		var ptY = uf.tileSize * scaleY * ( ulTileLat - latP );

		return { 
			tileX: tileX, tileY: tileY,
			ulTileLat: ulTileLat, ulTileLon: ulTileLon,
			deltaLat: deltaLat, deltaLon: deltaLon,
			scaleX: scaleX, scaleY: scaleY,
			ptX: ptX, ptY: ptY
		};
	}

	uf.setCamera = function() {
		uf.controls.target.set( uf.tarX, uf.tarY, uf.tarZ  );
		uf.camera.position.set( uf.camX, uf.camY, uf.camZ );
		uf.camera.up = new THREE.Vector3( 0, 1, 0 );
	}

	function lon2tile( lon, zoom ) {
		return Math.floor( ( lon + 180 ) / 360 * Math.pow( 2, zoom ) );
	}

	function lat2tile( lat, zoom ) {
		return Math.floor(( 1 - Math.log( Math.tan( lat * Math.PI / 180) + 1 / Math.cos( lat * Math.PI / 180)) / Math.PI)/2 * Math.pow(2, zoom) );
	}

	function tile2lon( x, zoom ) {
		return ( x / Math.pow( 2, zoom ) * 360 - 180 );
	}

	function tile2lat( y, zoom ) {
		var n = Math.PI - 2 * Math.PI * y / Math.pow( 2, zoom );
		return 180 / Math.PI * Math.atan( 0.5 * ( Math.exp( n ) - Math.exp( -n ) ));
	}

	uf.animate = function() {
		requestAnimationFrame( uf.animate );
		uf.controls.update();
		uf.renderer.render( uf.scene, uf.camera );
	}
