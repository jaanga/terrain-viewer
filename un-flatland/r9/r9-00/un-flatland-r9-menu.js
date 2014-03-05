	var varIndex = [ 'zoom', 'lat', 'lon', 'start', 'map', 'placards', 'scale', 'tiles', 'verts', 'camx', 'camy', 'camz', 'targetx','targety', 'targetz' ];
//	var varDefaults = [ 9, 37.78, -122.41, 1624, 5, 1, 5, 2, 32, 500, 1200, 1500, 0, 0, 0 ];
	var varDefaults = [ 9, 37.796, -122.398, 1624, 5, 0, 5, 2, 32, 300, 500, 600, 0, 0, 0 ];
	var varValues = varDefaults.slice();

	var offsetX;
	var offsetY;

	function addMenu() {

		var data = requestFile( '../../../terrain-plus/gazetteer/places-2000.csv' );
		var lines = data.split(/\r\n|\n/);
		uf.gazetteer = [ ['Select a location','',''] ];
		for ( var i = 1, length = lines.length; i < length; i++ ) {
			pl = lines[i].split( ';' ) 
			uf.gazetteer.push( [ pl[0], parseFloat( pl[1] ), parseFloat( pl[2] ) ] );
		}

		parsePermalink();

		var css = document.body.appendChild( document.createElement('style') );
		css.innerHTML = 'body { font: 600 12pt monospace; margin: 0; overflow: hidden; }' +
			'h1 { margin: 0; }' +
			'h1 a {text-decoration: none; }' +
			'td {font: 400 10pt monospace; }' +
			'#closer { position: absolute; right: 5px; top: 5px; }' +
			'#movable { overflow: scroll; margin: 20px; padding: 30px 20px; position: absolute; resize: both; }' +
		'';

		uf.info = document.body.appendChild( document.createElement( 'div' ) );
		uf.info.id = 'movable';
		uf.info.style.cssText = ' background-color: #ccc; left: 20px; opacity: 0.8; top: 20px; ';
		uf.info.addEventListener( 'mousedown', mouseMove, false );
		uf.info.innerHTML = '<div onclick=info.style.display="none";stats.domElement.style.display="none"; >[x]</div>' +
			'<h1><a href="" >' +
				'Jaanga unFlatland<br>r9</a> ' +
				'<a href=# title="Get help and info" onclick=help.style.display="block"; ><large>&#x24D8;</large></a>' +
			'</h1>' +
			'<p>' +
				'Zoom: &nbsp;  &nbsp;<input id=setZoom title="0 to 18: OK"type=number min=0 max=18 step=1 ><br>' +
				'Scale:  &nbsp; <input id=setScale type=number min=1 max=50 ><br>' +
				'Overlay: <select id=selMapType title="Select the 2D overlay" ><select>' +
			'</p>' +
			'<hr>' +

				'Tiles/side: <input id=setTiles title="2 to 8: normal. 16+: pushing" type=number min=1 max=32 ><br>' +
				'Vertex/tile: <input id=setVerts title="16 to 32: OK. 64+: pushing" type=number min=16 max=128 ><br>' +
				'<hr>' +

				'Location<br>' +
				'Lat: <input id=inpLat  type="text" size=8 /> ' +
				'Lon: <input id=inpLon type="text" size=8 /> ' +
				'<button id=butGo title="Click Go to update location longitude and latitude" >Go</button><br>' +
				'<select id=selPlace ' + 
					'onchange="inpLat.value = lat = gazetteer[this.selectedIndex][1]; inpLon.value = lon = gazetteer[this.selectedIndex][2]; initMap();" >' +
				'</select>' +
				'<hr>' +
				'<p>' +
					'Camera<br>' +
					'Lat:<input id=inpCamLat type="text" size=6 />' +
					'Lon:<input id=inpCamLon type="text" size=6 />' +
					'Alt:<input id=inpCamAlt type="text" size=5 />' +
				'</p>' +

				'<p>' +
					'Camera Target<br>' +
					'Lat:<input id=inpTarLat type="text" size=6 />' +
					'Lon:<input id=inpTarLon type="text" size=6 />' +
					'Alt:<input id=inpTarAlt type="text" size=5 />' +
					'<button id=butCam title="Click Go to update camera and target longitude and latitude" >Go</button>' +
				'</p>' +

				'<p><input id=chkPlacards type="checkbox" >Display Placards </p>' +
				'<p>' +
					'<a href=JavaScript:setPermalink(); >Permalink</a> ' +
					'<a href=JavaScript:clearPermalink(); >Clear Permalink</a> &nbsp;' +
					'<a href=JavaScript:viewPNG(); >View PNG</a></p>' +
				'<p>' +
					'<a href=JavaScript:cameraToLocstion(); ><s>Camera to Location</s></a> ' +
					'<a href=JavaScript:cameraToPermalink(); >Link to View</a>' +
				'</p>' +
			'</div>' +
			'<hr>' +
			'<div id=menuTop ></div>' +
			'<div id=menuMiddle></div>' +
			'<div id=menuBottom ></div>' +
			'<div id=messages></div>';

		menuBottom.innerHTML = '<h1>' +
			'<a href=JavaScript:getTile("left"); >&#8678;</a> ' +
			'<a href=JavaScript:getTile("right"); >&#8680;</a> ' +
			'<a href=JavaScript:getTile("up"); >&#8679;</a> ' +
			'<a href=JavaScript:getTile("down"); >&#8681;</a>' +
		'</h1>' + '';

		setZoom.value = uf.zoom;
		setZoom.onchange = function() { uf.zoom = this.value; uf.drawTerrain(); };

		setScale.value = uf.scaleVert;
		setScale.onchange = function() { uf.scaleVert = this.value; uf.drawTerrain(); };

		for ( var option, i = 0, len = uf.mapTypes.length; i < len; i++ ) {
			selMapType.appendChild( option = document.createElement( 'option' ) );
			selMapType.children[i].text = uf.mapTypes[i][0];
		}
		selMapType.selectedIndex = uf.mapType;
		selMapType.onchange = function() { uf.mapType = this.selectedIndex; uf.drawTerrain(); };
//		console.log( this, this.value, this.selectedIndex );
		setTiles.value = uf.tilesPerSide;
		setTiles.onchange = function() { uf.tilesPerSide = this.value; uf.drawTerrain(); };

		setVerts.value = uf.vertsPerTile;
		setVerts.onchange = function() { uf.vertsPerTile = this.value; uf.drawTerrain(); };

		for ( var i = 1, length = lines.length; i < length; i++ ) {
			selPlace.appendChild( document.createElement( 'option' ) );
			selPlace.children[ i - 1].text = uf.gazetteer[i - 1][0];
		}

		inpLat.value = uf.lat;
		inpLon.value = uf.lon;
		butGo.onclick = function() { uf.lat = parseFloat(inpLat.value); uf.lon = parseFloat(inpLon.value); uf.drawTerrain(); };

		inpCamLat.value = uf.camX;
		inpCamLon.value = uf.camY;
		inpCamAlt.value = uf.camZ;

		inpTarLat.value = uf.tarX;
		inpTarLon.value = uf.tarY;
		inpTarAlt.value = uf.tarZ;

		selPlace.selectedIndex = uf.startPlace;
		selPlace.onchange = function() { 
			uf.startPlace = this.selectedIndex; 
			inpLat.value = uf.lat = uf.gazetteer[ uf.startPlace ][1];
			inpLon.value = uf.lon = uf.gazetteer[ uf.startPlace ][2];
			uf.drawTerrain(); 
		}

		chkPlacards.checked = uf.displayPlacards > 0 ? true : false;
		chkPlacards.onchange = function() { uf.displayPlacards = chkPlacards.checked; updatePlacards(); }
	}

	function addHelp() {
		help = document.body.appendChild( document.createElement( 'div' ) );
		help.style.cssText = 'display: none; background-color: #ccc; left: 50px; opacity: 0.9; padding: 20px; ' +
			'bottom: 0; left: 0; height: 200px; margin: auto; position: absolute; right: 0; top: 0; width: 500px; zIndex:10; ';
		help.innerHTML = 
			'<div onclick=help.style.display="none"; >' +
				'<b>Jaanga unFlatland R9</b><br><br>' +

				'<a href="https://github.com/jaanga/terrain-viewer/tree/gh-pages/un-flatland" target="_blank">Source code</a><br>' +
				'<small>credits: <a href="http://threejs.org" target="_blank">three.js</a> - ' +
				'<a href="http://khronos.org/webgl/" target="_blank">webgl</a> - ' +
				'<a href="http://jaanga.github.io" target="_blank">jaanga</a><br>' +
				'copyright &copy; 2014 Jaanga authors ~ MIT license</small><br><br>' +
				'<i>Click anywhere in this message to hide...</i>' +
		'</div>';
	}

	function updatePlacards() {

		if ( uf.placards && uf.placards.children.length > 0) {
			uf.scene.remove( uf.placards );
			uf.placards.children.length = 0;
		}
		if ( !uf.displayPlacards ) return;

		uf.placards = new THREE.Object3D;

		var pointHome = uf.getPoint( uf.lat, uf.lon, uf.zoom );
		msg.innerHTML = 'pointHome ' + uf.lat + ' ' + uf.lon + b +
			'pointHome tiles: ' + pointHome.xTile + ' ' + pointHome.yTile + b +
			'Tile ul Lat: ' + pointHome.ulLatTile.toFixed(5) + ' lon:' + pointHome.ulLonTile.toFixed(5) + b +
			'Tile delta lat: ' + pointHome.deltaLat.toFixed(5) + ' lon:' + pointHome.deltaLon.toFixed(5) + b + b +
			'Point x: ' + pointHome.xPt.toFixed(5) + ' y:' + pointHome.yPt.toFixed(5) + b + b +
		'';

		var offset = -256;
		var mesh = drawObject( pointHome.xPt + offset, 10, pointHome.yPt + offset);
		mesh.scale.set( 5, 150, 5 );
		uf.placards.add( mesh );

		for ( var i = 0, iLen = uf.gazetteer.length; i < iLen; i++ ) {
			place = uf.gazetteer[i];
			if ( place[1] < uf.latULStart && place[1] > uf.latFinish && place[2] > uf.lonULStart  && place[2] < uf.lonFinish) {
				point = uf.getPoint( place[1], place[2], uf.zoom );
				var offsetX = -256 + uf.tileWidth * ( point.xTile - pointHome.xTile );
				var offsetY = -256 + uf.tileWidth * ( point.yTile - pointHome.yTile );

				var mesh = drawObject( point.xPt + offsetX, 10, point.yPt + offsetY);
				mesh.scale.set( 10, 10, 10 );
				uf.placards.add( mesh );

				mesh = drawSprite( place[0], '#0f0', point.xPt + offsetX, 120, point.yPt + offsetY);
				uf.placards.add( mesh );
			}
		}

		uf.scene.add( uf.placards );
	}

	function setPermalink() {
		var txt = '';
		if ( uf.camX && uf.camX !== varDefaults[9] ) txt += '#camx=' + parseInt( uf.camX, 10 );
		if ( uf.camY && uf.camY !== varDefaults[10] ) txt += '#camy=' + parseInt( uf.camY, 10 );
		if ( uf.camZ && uf.camZ !== varDefaults[11] ) txt += '#camz=' + parseInt( uf.camZ, 10 );

		if ( uf.tarX && uf.tarX !== varDefaults[12] ) txt += '#targetx=' + parseInt( uf.tarX, 10 );
		if ( uf.tarY && uf.tarY !== varDefaults[13] ) txt += '#targety=' + parseInt( uf.tarY, 10 );
		if ( uf.tarZ && uf.tarZ !== varDefaults[14] ) txt += '#targetz=' + parseInt( uf.tarZ, 10 );

		if ( uf.displayPlacards !== varDefaults[5] ) txt += '#placards=' + uf.displayPlacards;
		if ( uf.startPlace !== varDefaults[3] && uf.startPlace !== "" ) txt += '#start=' + parseInt( uf.startPlace, 10 );

		if ( uf.startPlace === varDefaults[3] && uf.startPlace !== "" && uf.lat !== varDefaults[1] ) txt += '#lat=' + uf.lat;
//		if ( icaoStartPlace === "" && lat !== varDefaults[1] ) txt += '#lat=' + lat;

		if ( uf.startPlace === varDefaults[3] && uf.startPlace !== "" && uf.lon !== varDefaults[2] ) txt += '#lon=' + uf.lon;
//		if ( icaoStartPlace === "" && lon !== varDefaults[2] ) txt += '#lon=' + lon;

		if ( uf.mapType !== varDefaults[4] ) txt += '#map=' + uf.mapType;
		if ( uf.scaleVert !== varDefaults[6] ) txt += '#scale=' + uf.scaleVert;
		if ( uf.tilesPerSide !== varDefaults[7] ) txt += '#tiles=' + uf.tilesPerSide;

		if ( uf.vertsPerTile !== varDefaults[8] ) txt += '#verts=' + uf.vertsPerTile;
		if ( uf.zoom !== varDefaults[0] ) txt += '#zoom=' + uf.zoom;

		window.location.hash = txt;
	}

	function cameraToPermalink() {
		uf.camX = uf.camera.position.x;
		uf.camY = uf.camera.position.y;
		uf.camZ = uf.camera.position.z;

		uf.tarX = uf.controls.target.x;
		uf.tarY = uf.controls.target.y;
		uf.tarZ = uf.controls.target.z;

		setPermalink();
	}
	
	function parsePermalink() {
		var item;
		var index;
		var hashes = location.hash.split('#');
		var place = false;

		for (var i = 1, len = hashes.length; i < len; i++) {
			item = hashes[i].split('=');
			index = varIndex.indexOf( item[0] );
			if ( index > -1 ) {
				varValues[ index ] = item[1];
				if ( index === 3  && item[1] !== varDefaults[3] ) place = true;
//console.log( item[1], varDefaults[3], place )
			}
		}

		uf.camX = parseFloat( varValues[9] );
		uf.camY = parseFloat( varValues[10] );
		uf.camZ = parseFloat( varValues[11] );

		uf.tarX = parseFloat( varValues[12] );
		uf.tarY = parseFloat( varValues[13] );
		uf.tarZ = parseFloat( varValues[14] );

		uf.zoom = parseInt( varValues[0], 10 );
		uf.lat = parseFloat( varValues[1] );
		uf.lon = parseFloat( varValues[2] );
		uf.startPlace = parseInt( varValues[3], 10 );
		if ( place == true ) {
			uf.lat = parseFloat( uf.gazetteer[ uf.startPlace ][1] );
			uf.lon = parseFloat( uf.gazetteer[ uf.startPlace ][2] );
		}
		uf.mapType = parseInt( varValues[4], 10);
		uf.displayPlacards = parseInt( varValues[5], 10);
		uf.scaleVert = parseInt( varValues[6], 10);
		uf.tilesPerSide = parseInt( varValues[7], 10 );
		uf.vertsPerTile = parseInt( varValues[8], 10);
	}

	function clearPermalink() {
		window.history.pushState( '', '', window.location.pathname);
	}

	function viewPNG() {
		window.location = 'http://jaanga.github.io/terrain-viewer/png-viewer/r3/png-viewer-r3.html#' + 
			lon2tile( uf.lon, 7 ) + '#' + lat2tile( uf.lat, 7 );
	}

// moving things about - bottom menu commands
	function getTile( direction ) {
		var max = Math.pow( 2, uf.zoom) - 1;
		var jump = uf.tilesPerSide / 2;
		var point = uf.getPoint( uf.lat, uf.lon, uf.zoom )
		if ( direction === 'left' ) {
			point.xTile -= jump;
			if ( point.xTile < 0 ) point.xTile = max;
		} else if ( direction === 'right' ) {
			point.xTile += jump;
			if ( point.xTile > max ) point.xTile = 0;
		} else if ( direction === 'up' ) {
			point.yTile -= jump;
			if ( point.yTile < 0 ) point.yTile = max;
		} else if ( direction === 'down' ) {
			point.yTile += jump;
			if ( point.yTile > max ) point.yTile = 0;
		}
		uf.lon = tile2lon( point.xTile, uf.zoom);
		uf.lat = tile2lat( point.yTile, uf.zoom);

		selPlace.selectedIndex = 0;
		uf.drawTerrain();
	}

	function drawObject( x, y, z ) {
		var geometry = new THREE.CubeGeometry( 1, 1, 1 );
		var material = new THREE.MeshNormalMaterial( { opacity: 0.5, transparent: true });
		var mesh = new THREE.Mesh( geometry, material );
		mesh.position.set( x, y, z) ;
		return mesh;
	}

	function drawSprite( text, color, x, y, z) {
		var distance = uf.camera.position.distanceTo( uf.controls.target );
		var scale = 0.0005 * distance;

		texture = canvasText( text, color )
		var spriteMaterial = new THREE.SpriteMaterial( { map: texture, useScreenCoordinates: false, opacity: 1 } );
		var sprite = new THREE.Sprite( spriteMaterial );
		sprite.position.set( x, y, z ) ;
		sprite.scale.set( scale * texture.image.width, scale * texture.image.height );
		return sprite;
	}

	function drawLine( vertices, color, linewidth) {
		function convert( element ) {
			return v( element[0], element[1], element[2] );
		}

		var geometry = new THREE.Geometry();
		geometry.vertices = vertices.map( convert );
		var material = new THREE.LineBasicMaterial( { color: color, linewidth: linewidth } );
		var line = new THREE.Line( geometry, material );
		return line;
	}

	function canvasText( text, color ) {
		var canvas = document.createElement( 'canvas' );
		var context = canvas.getContext( '2d' );

		context.font = '18px sans-serif';
		var width = context.measureText( text );

		canvas.width = ( width.width + 10 ) ; // 480
		canvas.height = 20;

		context.fillStyle = color;
		context.fillRect( 0, 0, canvas.width, canvas.height);

		context.lineWidth = 1 ;
		context.strokeStyle = '#000';
		context.strokeRect( 0, 0, canvas.width, canvas.height);

		context.fillStyle = '#000' ;
		context.font = '18px sans-serif';
		context.fillText( text, 5, 17 );

		var texture = new THREE.Texture( canvas );
		texture.needsUpdate = true;
		return texture;
	}

// events
	function mouseUp() {
		window.removeEventListener('mousemove', divMove, true);
	}

	function mouseMove( event ){
		if ( event.target.id === 'movable' ) {
			event.preventDefault();

			offsetX = event.clientX - event.target.offsetLeft;
			offsetY = event.clientY - event.target.offsetTop;
			window.addEventListener('mousemove', divMove, true);
		}
	}

	function divMove( event ){
		event.target.style.left = ( event.clientX - offsetX ) + 'px';
		event.target.style.top = ( event.clientY - offsetY ) + 'px';
	}

	function requestFile( fname ) {
		var xmlHttp = new XMLHttpRequest();
		xmlHttp.crossOrigin = "Anonymous"; 
		xmlHttp.open( 'GET', fname, false );
		xmlHttp.send( null );
		return xmlHttp.responseText;
	}
