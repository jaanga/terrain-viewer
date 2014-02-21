PNG Viewer Read Me
==================

<iframe src=http://jaanga.github.io/terrain-viewer/png-viewer/r3/png-viewer-r3.html width=96% height=600px >
visible here: http://jaanga.github.io/terrain-viewer/png-viewer/ </iframe>
_Cropped iframe view of PNG Viewer with default image_

[PNG Viewer ~ default (San Francisco Bay Area)]( http://jaanga.github.io/terrain-viewer/png-viewer/latest/index.html )   

* Currrent rev is r3
* The default image is not a great place to start because not much to see, but there is much to see over to the right and down
* This image is used as the default here because it is the default in many of the other Terrain apps  

[PNG Viewer r3 ~ Barcelona]( http://jaanga.github.io/terrain-viewer/png-viewer/r3/png-viewer-r3.html#64#47 )  
[PNG Viewer r3 ~ Zurich]( http://jaanga.github.io/terrain-viewer/png-viewer/r3/png-viewer-r3.html#67#44 )  

## Concept

Display any of the 16,384 Jaanga Terrain 3 Second PNG files quickly and easily

## Project Links

You have two ways of viewing the PNG Viewer files:

* Code hosted on GitHub: [jaanga.github.io]( http://jaanga.github.io/terrain-viewer/png-viewer/ "view the files as apps." ) <input value="<< You are now probably here." size=28 style="font:bold 12pt monospace;border-width:0;" >  
* Source code on GitHub: [jaanga.com/fgx]( https://github.com/jaanga/terrain-viewer/tree/gh-pages/png-viewer/ "View the files as source code." ) <scan style=display:none ><< You are now probably here.</scan>


## Features

- Loads 3 second data quickly (accurate to 90 meters) 
- Shows data for any location on the globe;
- Select location by tile or by a dropdown gazetteer with over 2000 locations
- Displays Tile 
	- X and Y
	- longitude and latitude for upper left and lower right corners
	- Delta latitude and longitude
- Displays image
	- width and height
	- Number of pixels
	- Number of shades
	- Minimum and maximum shades numbers
- Display all locations in Gazetteer with the current tile area
	- Shows place name and relative elevation
- Creates and reads permalink hash tags for position
- Link to 'Hello World' to view data in 3D
- Very simple JavaScript code

## Road Map

* Load a number of images and tally the total number of colors used

### System Requirements

The apps here are currently being built and tested with the Google Chrome browser. 
Bugs on browsers other than Chrome need not be reported until such time as the work settles down and an effort to support more browsers is initiated.


### Copyright and License
copyright &copy; 2014 Jaanga authors ~ All work herein is under the [MIT License](http://jaanga.github.io/libs/jaanga-copyright-and-mit-license.md)

This repository is at an early and volatile stage. Not all licensing requirements may have been fully met let alone identified. It is the intension of the authors to play fair and all such requirements will either be met or the feature in question will turned off.

### Change Log

2014-02-20 ~ Theo

* Updates to menu and read me files

2014-02-05 ~ Theo

* R3 Committed
* Code clean up
* Link to unFlatland started - not working because unFlatLand does not do low zoom levels yet.
* reset permalink each redraw
* split menu into sections, but work is incomplete
* Added lighten image function 
* Display all gazetted locations and an altitude indicator
* Add Gazetteer

2014-01-30 ~ Theo

* r2.1
* Select lat and lon
* Fix lat lon number display errors
* Display place names in re-sizable textarea
* Shade swatch with mouse move updates

2014-01-29 ~ Theo

* R2 with many new features


2014-01-29 ~ Theo

* Update Read Me


2014-01-22~ Theo

* R1 first commit