
[![Build Status](https://travis-ci.org/golgistudio/d3-scatter-plot.svg?branch=master)](https://travis-ci.org/golgistudio/d3-scatter-plot)

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
  * [Conmponents](#components)
    *  [Navigation](#navigation)
    *  [Chart](#chart)
    *  [Design Patterns](#design)
  * [Resources](#resources)


## Overview


This is an example scatter plot built with D3.   It is a simple application that can be used to explore data interactions and design data applications.


## Getting started


The build system is based on vigetlabs excellent build system - [gulp-starter](https://github.com/vigetlabs/gulp-starter) and works on Linux and Mac computers.

Clone the repository, install the node dependencies and run the commands below to run the development version of the site.   Note node is only used for the build system. This will run gulp with the following tasks

1.  Compile with webpack all js files
2.  Publish a local version of the site to demoApp/public
3.  Combine  all the JS and css files into single js and css files.
4.  Update path references to js, css and image files.
5.  Launch the site in a browser window (http://localhost:3000)
6.  Launch browsersync (http://localhost:3001)

```bash
git clone https://github.com/golgistudio/d3-scatter-plot.git MyApp
cd MyApp
npm install
npm run gulp
```

But wait, there is more...

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



## Running the application


## Components



### Chart




### Design Patterns





## Resources



