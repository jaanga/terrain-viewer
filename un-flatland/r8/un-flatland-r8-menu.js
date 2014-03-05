	var info;

	var pi = Math.PI, pi05 = pi * 0.5;
	var d2r = pi / 180, r2d = 180 / pi;  // degress / radians

	var mapTypes = [
		['Colorful',''],
		['Google Maps','http://mt1.google.com/vt/x='],
		['Google Maps Terrain','http://mt1.google.com/vt/lyrs=t&x='],
		['Google Maps Satellite','http://mt1.google.com/vt/lyrs=s&x='],
		['Google Maps Hybrid','http://mt1.google.com/vt/lyrs=y&x='],
		['Open Street Map','http://b.tile.openstreetmap.org/'],
		['Open Cycle Map', 'http://c.tile.opencyclemap.org/cycle/'],
		['MapQuest OSM', 'http://otile3.mqcdn.com/tiles/1.0.0/osm/'],
		['MapQuest Satellite', 'http://otile3.mqcdn.com/tiles/1.0.0/sat/'],
		['Stamen terrain background','http://tile.stamen.com/terrain-background/'],
		['HeightMap','../../../terrain/'],
		['Wireframe','']
	];

	function addMenu() {

		var css = document.body.appendChild( document.createElement('style') );
		css.innerHTML = 'body { font: 600 12pt monospace; margin: 0; overflow: hidden; }' +
			'h1 { margin: 0; }' +
			'h1 a {text-decoration: none; }' +
			'td {font: 400 10pt monospace; }' +
			'#closer { position: absolute; right: 5px; top: 5px; }' +
			'#movable { overflow: scroll; margin: 20px; padding: 30px 20px; position: absolute; resize: both; }' +
		'';

		info = document.body.appendChild( document.createElement( 'div' ) );
		info.id = 'movable';
		info.style.cssText = ' background-color: #ccc; left: 20px; opacity: 0.8; top: 20px; ';
		info.addEventListener( 'mousedown', mouseMove, false );
		info.innerHTML = '<div onclick=info.style.display="none";stats.domElement.style.display="none"; >[x]</div>' +
			'<h1><a href="" >' +
				'FGx Plane Spotter<br>r2</a> ' +
				'<a href=# title="Get help and info" onclick=help.style.display="block"; ><large>&#x24D8;</large></a>' +
			'</h1>' +
			'<div>' +
				'Zoom: &nbsp;  &nbsp;<input title="0 to 18: OK" id=setZoom type=number min=0 max=18 step=1 ><br>' +
				'Scale:  &nbsp; <input id=setScale type=number min=1 max=50 onchange=scaleVert=this.value;initMap(); ><br>' +
				'Overlay: <select title="Select the 2D overlay" id=selMapType ><select><hr>' +

				'Tiles/side: <input title="2 to 8: normal. 16+: pushing" id=setTiles type=number min=1 max=32 onchange=tilesPerSide=this.value;setLocation(); ><br>' +
				'Vertex/tile: <input title="16 to 32: OK. 64+: pushing" id=setVerts type=number min=16 max=128 onchange=vertsPerTile=this.value;setLocation(); ><br>' +
				'<hr>' +
				'Location<br>' +
				'Lat: <input type="text" id="inpLat" size=8 /><br>' +
				'Lon: <input type="text" id="inpLon" size=8 /> ' +
				'<button onclick="lat = inpLat.value;  lon = inpLon.value; setLocation();" title="Click Go to update camera longitude and latitude" >Go</button><br>' +
				'<select id=selPlace ' + 
					'onchange="inpLat.value = lat = gazetteer[this.selectedIndex][1]; inpLon.value = lon = gazetteer[this.selectedIndex][2]; initMap();" >' +
				'</select>' +

				'<p><input id=chkdiagrams type="checkbox" onchange=updatediagrams(); >Diagrams</p>' +
				'<a href=JavaScript:link(); >permalink</a> &nbsp;' +
				'<a href=JavaScript:viewPNG(); >View PNG</a><hr>' +
			'</div>' +
			'<div id=menuTop ></div>' +
			'<div id=menuMiddle></div>' +
			'<div id=menuBottom ></div>' +
			'<div id=messages></div>';

		menuBottom.innerHTML = '<h1>' +
			'<a href=JavaScript:getTile("left"); >&#8678;</a> ' +
			'<a href=JavaScript:getTile("right"); >&#8680;</a> ' +
			'<a href=JavaScript:getTile("up"); >&#8679;</a> ' +
			'<a href=JavaScript:getTile("down"); >&#8681;</a>' +
		'</h1>' +
		'<div>' +
			'<a href=JavaScript:cameraToATC(); >View the ATC</a> ' +
			'<a href=JavaScript:cameraToPermalink(); >Link to View</a>' +
		'</div>';

		for ( var option, i = 0, len = mapTypes.length; i < len; i++ ) {
			selMapType.appendChild( option = document.createElement( 'option' ) );
			selMapType.children[i].text = mapTypes[i][0];
		}
		selMapType.onchange = initMap;
		selMapType.selectedIndex = mapType;

		var data = requestFile( '../../../terrain-plus/gazetteer/places-2000.csv' );
		var lines = data.split(/\r\n|\n/);
		gazetteer = [ ['Select a location','',''] ];

		for ( var i = 1, length = lines.length; i < length; i++ ) {
			pl = lines[i].split( ';' ) 
			gazetteer.push( [ pl[0], parseFloat( pl[1] ), parseFloat( pl[2] ) ] );
			selPlace.appendChild( document.createElement( 'option' ) );
			selPlace.children[ i - 1].text = gazetteer[i - 1][0];
		}
		// selPlace.onchange = initMap;
		selPlace.selectedIndex = startPlace;

		place = gazetteer[ selPlace.selectedIndex ];
		lat = place[1];
		lon = place[2];
	}

	function addHelp() {
		help = document.body.appendChild( document.createElement( 'div' ) );
		help.style.cssText = 'display: none; background-color: #ccc; left: 50px; opacity: 0.9; padding: 20px; ' +
			'position: absolute; top: 50px; width: 500px; zIndex:10; ';
		help.innerHTML = 
			'<div onclick=help.style.display="none"; >' +
				'<b>Jaanga unFlatland R8</b><br><br>' +

				'<a href="https://github.com/jaanga/terrain-viewer/tree/gh-pages/un-flatland" target="_blank">Source code</a><br>' +
				'<small>credits: <a href="http://threejs.org" target="_blank">three.js</a> - ' +
				'<a href="http://khronos.org/webgl/" target="_blank">webgl</a> - ' +
				'<a href="http://jaanga.github.io" target="_blank">jaanga</a><br>' +
				'copyright &copy; 2014 Jaanga authors ~ MIT license</small><br><br>' +
				'<i>Click anywhere in this message to hide...</i>' +
		'</div>';
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

			mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
			mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
		}
	}

	function divMove( event ){
		event.target.style.left = ( event.clientX - offsetX ) + 'px';
		event.target.style.top = ( event.clientY - offsetY ) + 'px';
	}

// The math
// http://wiki.openstreetmap.org/wiki/Slippy_map_tilenames#Tile_servers
	function lon2tile( lon, zoom ) {
		return Math.floor( ( lon + 180 ) / 360 * pow( 2, zoom ) );
	}

	function lat2tile( lat, zoom ) {
		return Math.floor(( 1 - Math.log( Math.tan( lat * pi / 180) + 1 / cos( lat * pi / 180)) / pi )/2 * pow(2, zoom) );
	}

	function tile2lon( x, zoom ) {
		return ( x / pow( 2, zoom ) * 360 - 180 );
	}

	function tile2lat( y, zoom ) {
		var n = pi - 2 * pi * y / pow( 2, zoom );
		return 180 / pi * Math.atan( 0.5 * ( Math.exp( n ) - Math.exp( -n ) ));
	}


	function cos( a ){ return Math.cos( a ); }
	function sin( a ){ return Math.sin( a ); }
	function pow( a, b ){ return Math.pow( a, b ); }
	function v( x, y, z ){ return new THREE.Vector3( x, y, z ); }

// ajax
	function requestFile( fname ) {
		var xmlHttp = new XMLHttpRequest();
		xmlHttp.crossOrigin = "Anonymous"; 
		xmlHttp.open( 'GET', fname, false );
		xmlHttp.send( null );
		return xmlHttp.responseText;
	}


