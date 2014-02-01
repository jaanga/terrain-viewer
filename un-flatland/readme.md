unFlatland Read Me
==================

Cropped iframe view of unFlatland r5:
<iframe src=http://jaanga.github.io/terrain-viewer/un-flatland/r5/un-flatland-r5.html width=96% height=600px >
Visible only in HTML view here: http://jaanga.github.io/terrain-viewer/un-flatland/ </iframe>

Live demo:
[unFlatland r6 Dev!]( http://jaanga.github.io/terrain-viewer/un-flatland/r6/un-flatland-r6.html )  

[unFlatland r5.1]( http://jaanga.github.io/terrain-viewer/un-flatland/r5/un-flatland-r5.html )

For an amusing applied use of this technology see: [FGx Plane Spotter]( http://fgx.github.io/fgx-plane-spotter/inde.html )

For [Leap Motion]( https://www.leapmotion.com/ ) device enabled and earlier versions see: [Flying Leap 3D]( https://github.com/jaanga/gestification/tree/gh-pages/projects/flying-leap-3d )


## Concept

### Mission
To supply the fastest, smallest, sweetest 3D map code you ever saw.


## Project Links

You have two ways of viewing the Jaanga Terrain Viewer unFlatland files:

* Code hosted on GitHub: [jaanga.github.io]( http://jaanga.github.io/terrain-viewer/un-flatland/ "view the files as apps." ) <input value="<< You are now probably here." size=28 style="font:bold 12pt monospace;border-width:0;" >  
* Source code on GitHub: [github.com/jaanga]( https://github.com/jaanga/terrain-viewer/tree/gh-pages/un-flatland "View the files as source code." ) <scan style=display:none ><< You are now probably here.</scan>


See also

* [Jaanga Terrain](  http://jaanga.github.io/terrain/ )
* [Janga Terrain Viewer](  http://jaanga.github.io/terrain-viewer/ )

## Features

* Covers every part of the world that Jaabga Terrain covers - sames as [OSM]( http://www.openstreetmap.org/ ) covers - matches [Slippy Map]( http://wiki.openstreetmap.org/wiki/Slippy_Map )
* Works in your browser  - no plugin required
* Runs files locally or sourced from a static file server - such as [GitHub Pages]( http://pages.github.com/ )
* Carries out all the interpolation necessary to view zoom levels 8 and higher
* Supports real-time zoom, pan and rotate
* Creates and reads permalinks for zoom, latitude, longitude, vertical scale and map type
* Toggle 3D placards that show place names
* Toggle display of menu and stats
* Easy to build your own place lists
* Supports large user-defined gazetteer
* Supports many 2D map overlays
* Provides a variety of navigation aides
* Generic 3D library - can be used with other apps and libraries
* FOSS, built with less than 500 lines of code
* Very small file size ~ you can easily open up and start hacking
* Fast enough to be usable. Display Frames per second


## Road Map

* Place cameras at designated locations
* Toggle between two types of camera controllers: first person or trackball
* Add skybox? Add fog?
* load four 128 x 128 meshes 
* Add diagonal navigation buttons
* Add and remove adjacent 3D tiles as needed
* Display adjacent tiles in 2D
* Can we get this down to 30 metre detail?  


## Issues and Bugs

2014-01-28  

If you go to some high altitude location such as Mount Everest or Machu Pichu - and see nothing - the map may be above you and you will need to drag it into view. 
This is a Jaanga Terrain issue. 

Vertical scale is is set quite high by default. This is to help provide a game-like experience. Feel free to change the scale.


## Links

See also the post on Jaanga.com: <http://jaanga.github.io/events/sf-webgl-2013-06-26/>

_See also the very interesting history of the word '[flatland](http://en.wikipedia.org/wiki/Flatland)'._

Older unFlatland versions:

[Live demo R3](http://jaanga.github.io/cookbook/un-flatland/r2/index.html )

[Live demo R2]( http://jaanga.github.io/cookbook/un-flatland/r3/index.html)



## System Requirements

The code on this site makes extensive use of the latest and most demanding Internet technologies - including HTML 5 and WebGL and HTML.

In order to view the files or run the apps on this web site you will need a device and browser that provides good support for [WebGL](http://get.webgl.org/).
WebGL is the JavaScript API for rendering interactive 3D graphics and 2D graphics within any compatible web browser without the use of plug-ins. 

Hardware: Generally WebGL support requires a computer with an Intel Core i5 processor or better with an external GPU such as one made by Nvidia or AMD. 
Successful use of the apps on a phone or tablet is highly unlikely. A computer that is good for heavy gaming is a likely to be satisfactory.
A mouse or other pointing device with a scroll wheel is also highly recommended so that you can zoom, pant and rotate in 3D.

Browser Support: The apps here are currently being and tested with the Google Chrome browser.
Bugs on browsers other than Chrome need not be reported until such as the work settles down and an effort to support more browsers is initiated.


## Copyright and License
copyright &copy; 2014 Jaanga authors ~ All work herein is under the [MIT License](http://jaanga.github.io/libs/jaanga-copyright-and-mit-license.md)



## Change Log

2014-01-30 ~ Theo

* Added toggle display of place name placards
* Addle toggle display of menu and stats

2014-01-29 ~ Theo

* Read me updated, iframe added

Fixed or dealt with:  
The current big issue is that - often but not always - nothing happens wnen you change the zoom, scale, overlay, latitude or longitude  
Workaround: Change city location - just about always causes an update

From R4 and before:

* <s>~~Works only in Chrome~~</s> fixed
* <s>~~Dropdown list items only update when you change city~~</s> fixed
* <s>~~First person controller: Mouse actions only work when initiated from top of screen. Should work from anywhere.~~</s> Fixed
* <s>~~Trackball controller: after you return from first person controller drop downs no longer work. Must reload page to make changes.~~</s> Fixed stupidly: reload page
* Elevation drops to naught on one side
* Go to lat/long then change scale: goes to previous location


2013-12-18 ~ Theo

* Expanding the read me


2013-12-17 ~ Theo

* Expanding Read Me
* Added index.html and latest.html

2013-12-15 ~ Theo

* R4.1
* Adds toggle to display placards with nearby place names

2013-12-14 ~ Theo

* Code clean up
* Help info added to
* Read me file added to
* Numerous bug fixes: works in FF. Mouse OK


2013-12-13 ~ Theo

* R4 Added
* Name space added
* place names from external file
* More overlay map choices
* Code clean up
* Select zoom levels
* Help screen added

