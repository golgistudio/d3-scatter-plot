
[![Build Status](https://travis-ci.org/golgistudio/d3-scatter-plot.svg?branch=master)](https://travis-ci.org/golgistudio/d3-scatter-plot) [![Stack Share](http://img.shields.io/badge/tech-stack-0690fa.svg?style=flat)](http://stackshare.io/golgistudio/visualizations) [![dependencies](https://david-dm.org/golgistudio/d3-scatter-plot.svg)](https://david-dm.org/davezuko/react-redux-starter-kit)
[![devDependency Status](https://david-dm.org/golgistudio/d3-scatter-plot/dev-status.svg)](https://david-dm.org/davezuko/react-redux-starter-kit#info=devDependencies)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/) [![npm](https://img.shields.io/npm/v/npm.svg)]()

D3 Scatter Plot demo application
================================

**Demo compiled and deployed with gulp-starter:** http://golgistudio.github.io/d3-scatter-plot

(view files on [gh-pages](https://github.com/golgistudio/d3-scatter-plot/tree/gh-pages) branch)

<img src="https://raw.githubusercontent.com/golgistudio/d3-scatter-plot/master/docs/images/InitialScreen.png" alt="D3 Scatter Plot initial screen" width="400">


## Table of contents


  * [Table of contents](#table-of-contents)
  * [Overview](#overview)
  * [Getting Started](#getting-started)
  * [Running the application](#running-the-application)
    *  [Navigation](#navigation)
    *  [Responsiveness](#responsiveness)
    *  [Plot Interactions](#plot-interactions)
  * [Design Patterns](#design-patterns)
  * [Resources](#resources)


## Overview


This is an example scatter plot built with D3.   It is a simple application that can be used to explore data interactions and design data applications.   Many D3 examples are static and hard coded, which makes it harder to explore interactions.  This example demonstrates the variety of changes and interactions one would expect in a D3 application.  It also separates out not only the data, but the properties that define the behavior so they can be changed via menu commands.  Finally, it uses design patterns to decouple components.  

A couple of guiding principles that were used
* Used only D3.js, no other external javascript libraries
* The navigation is intentionally very basic for quick prototyping
* Used Es6 modules



## Getting started


The build system is based on vigetlabs excellent build system - [gulp-starter](https://github.com/vigetlabs/gulp-starter) and works on Linux and Mac computers.

Clone the repository, install the node dependencies and run the commands below to run the development version of the site.   Note node is only used for the build system. This will run gulp with the following tasks

1.  Compile with webpack all js files
2.  Publish a local version of the site to demoApp/public
3.  Combine  all the JS and css files into single js and css files.
4.  Update path references to js, css and image files.
5.  Launch the site in a browser window using express (http://localhost:3000)
6.  Launch browsersync (http://localhost:3001)

```bash
git clone https://github.com/golgistudio/d3-scatter-plot.git MyApp
cd MyApp
npm install
npm run gulp
```

To run a production version of the site...
```bash
npm run demo
```

To run tests...
```bash
npm run test
```

To generate documentation which will be output in demoApp/quality/docs.  This is currently using jsdoc by itself, because es6 doesn't seem to be fully supported yet in the gulp version.
```bash
npm run doc
``` 

To run jshint....
```bash
npm run gulp jshint
```

To deploy to ghpages...
```bash
in package.json, set the homepage to be your gh-pages site.
npm run deploy
```

Travis integration - .travise.yml

## Running the application

Navigate to one the following sites:
[Experiment A](http://golgistudio.github.io/d3-scatter-plot/?exp=ExpA)
[Experiment B](http://golgistudio.github.io/d3-scatter-plot/?exp=ExpB)

### Navigation

#### Data
* Reset - Restore original data set
* Add - Update data set with new points
* Remove - Updae data set by removing points
* Change - Update data set by changing the values of existing points

#### Symbol
* Circle
* Triangle
* Icon 
* Square


#### Color
* Blue
* Purple

#### Plot Style
* Scatter
* Barchart

#### Experiment - change the experiment including titles, leged, tooltips, labels
* Experiment A
* Experiment B

#### Undo & Redo
* Undo
* Redo
* Unwind (ToDo)
* Rewind (ToDo)

#### Language (ToDo)

### Responsiveness
* Resizes with the window resize
* Responds to orientation changes

### Plot interactions
* Tooltip on hover
* Highlight points on both charts with the same x-axis value
* Y axis zoom
* Click legend item to toggle plot on/off

## Design Patterns
* Command pattern - all menu commands, undo & redo
* Mediator pattern - event manager
* Singleton - Datastore
* Factory - ScatterPlot

## Resources

#### D3 
* [D3js.org](d3js.org)
* [Tutorials | Blogs | Books | etc](https://github.com/mbostock/d3/wiki/Tutorials)
* [Gallery](https://github.com/mbostock/d3/wiki/Gallery)

#### D3 Code Snippets
* [zoom, pan, and axis rescale by stepheneb](http://bl.ocks.org/stepheneb/1182434)
* [Zoomable Scatterplot by petersonjonas](http://bl.ocks.org/peterssonjonas/4a0e7cb8d23231243e0e)
* [Zoom Ordinal scales](http://jsfiddle.net/9rypxf10/)
* [Hover behavior with lines drawn to axes by nsonnad](http://bl.ocks.org/nsonnad/4481531)
* [Simple D3 Line chart with Legend and Tooltips by bobmonteverde](http://bl.ocks.org/bobmonteverde/2070123)
* [Vertical icon navigation with slide-out menu by nikhil](http://codepen.io/nikhil/pen/sicrK)
* [Linking plots by jvadams](http://jsfiddle.net/JVAdams/bTHk2/2/)
* [Handline clipping on zoom](http://bl.ocks.org/mbostock/4015254)


#### Build Tools
* [Web Developer Checklist](http://webdevchecklist.com/)
* [Gulp starter](http://golgistudio.github.io/d3-scatter-plot)
* [Gulp](http://gulpjs.com/)
* [Webpack](https://webpack.github.io/)
* [JS Docs - generate documentation from annotated comments](http://usejsdoc.org/)
* [JSHint - syntax checker for javascript](http://jshint.com/)
* [browsersync](http://www.browsersync.io/)
* [Karma - javascript test runner](http://karma-runner.github.io/0.13/index.html)
* [babel - javascript compiler](https://babeljs.io/)
* [mocha - testing framework](https://mochajs.org/)
* [Sinon.js - javascript mocks](http://sinonjs.org/docs/)
* [Uglify](https://github.com/mishoo/UglifyJS2)
* [npm - package manager](https://www.npmjs.com/)
* [Github](https://github.com/)


#### Design Patterns
* [Design Patterns: Elements of Reusable Object-Oriented Software by Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides](http://www.amazon.com/Design-Patterns-Elements-Reusable-Object-Oriented-ebook/dp/B000SEIBB8)
* [Learning Javascript Design Patterns by Addy Osmani](http://addyosmani.com/resources/essentialjsdesignpatterns/book/)

