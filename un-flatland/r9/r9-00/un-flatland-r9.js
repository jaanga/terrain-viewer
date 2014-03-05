	var uf = uf || {};

	uf.lat = 37.796;
	uf.lon = -122.398;  // me
	uf.camX = 800; uf.camY = 350; uf.camZ = 800;
	uf.tarX = 0; uf.tarY = 0; uf.tarZ = 0;
	uf.zoom = 10;
	uf.scaleVert = uf.zoom - 4;
	uf.tileWidth = 256;
	uf.tilesPerSide = 5;
	uf.vertsPerTile = 32;
	uf.mapType = 5;
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

	uf.drawCanvasImage = function( images, idx, point7, latCur, lonCur, ii, jj ) {
		return function() {

			var mesh, geometry, material, texture; 

			var offset = -0.5 * uf.tileWidth * uf.tilesPerSide; // Remember: Tiles are drawn from their centers
			var pointZoomWin = uf.getPoint( latCur, lonCur, uf.zoom );

			var startX = images[idx].width  * point7.scaleX * ( pointZoomWin.ulTileLon - point7.ulTileLon);
			var startY = images[idx].height * point7.scaleY * ( point7.ulTileLat - pointZoomWin.ulTileLat );

// folowing is probably not accurate
			var width = images[idx].width * point7.scaleX * pointZoomWin.deltaLon;
			var height = images[idx].height * point7.scaleY * pointZoomWin.deltaLat;

			uf.context.drawImage( images[idx], startX, startY, width, height, 0, 0, uf.vertsPerTile, uf.vertsPerTile);
			var imgd = uf.context.getImageData( 0, 0, uf.vertsPerTile, uf.vertsPerTile ).data;

			geometry = new THREE.PlaneGeometry( uf.tileWidth, uf.tileWidth, uf.vertsPerTile - 1, uf.vertsPerTile - 1);
 			geometry.applyMatrix( new THREE.Matrix4().makeRotationX( -0.5 * Math.PI ) );

			var verts = geometry.vertices;
			var scl = 0.03 * uf.scaleVert * uf.zoom ;
			for ( var i = 0, j = 0, len = imgd.length; i < len; i += 4 ) {
				verts[j++].y = 1 + scl * imgd[i];
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
			mesh.position.set( ii * uf.tileWidth + offset + 0.5 * uf.tileWidth, 0, jj * uf.tileWidth + offset + 0.5 * uf.tileWidth );
			uf.terrain.add( mesh );
		}
	}

	uf.init = function() {
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

	uf.drawTerrain = function() {
		if ( uf.terrain ) uf.scene.remove( uf.terrain );
		uf.terrain = new THREE.Object3D();
		uf.offset =  -0.5 * uf.tileWidth * uf.tilesPerSide; // Remember: Tiles are drawn from their centers

		uf.start = Math.floor( 0.5 * ( uf.tilesPerSide - 1 )  );
		var count = 0;
		var images = [];

		uf.pointZoomWin = uf.pointZoomWinStart = uf.getPoint( uf.lat, uf.lon, uf.zoom );
//
		uf.latULStart = uf.pointZoomWin.ulTileLat + uf.start * uf.pointZoomWin.deltaLat;
		var latStart = uf.lat + uf.start * uf.pointZoomWin.deltaLat;
		var latCurrent; // = uf.lat + uf.start * uf.pointZoomWin.deltaLat;

		uf.lonULStart = uf.pointZoomWin.ulTileLon - uf.start * uf.pointZoomWin.deltaLon;
		var lonStart = uf.lon - uf.start * uf.pointZoomWin.deltaLon;
		var lonCurrent; // = uf.lon - uf.start * uf.pointZoomWin.deltaLon;

		var pointLevel7, xDir;
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
		uf.latFinish = latCurrent;
		uf.lonFinish = lonCurrent;
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

		var ptX = uf.tileWidth * scaleX * ( lonP - ulTileLon);
		var ptY = uf.tileWidth * scaleY * ( ulTileLat - latP );

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
		requestAnimationFrame( animate );
		uf.controls.update();
		uf.renderer.render( uf.scene, uf.camera );
	}
