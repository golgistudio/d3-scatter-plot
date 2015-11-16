/**
 * @file
 */





// Update with new values
// http://bl.ocks.org/WilliamQLiu/bd12f73d0b79d70bfbae
//http://jsfiddle.net/zhFbn/

// zoom
// http://jsfiddle.net/Nu95q/12/
// http://bl.ocks.org/stepheneb/1182434
//http://bl.ocks.org/peterssonjonas/4a0e7cb8d23231243e0e
// Ordinal scales - http://jsfiddle.net/9rypxf10/

// Append lines
// http://bl.ocks.org/nsonnad/4481531

// Legend
// http://bl.ocks.org/ZJONSSON/3918369

// Clickable legend
// http://bl.ocks.org/bobmonteverde/2070123
// https://gist.github.com/bobmonteverde/2070123

// Understanding clipping issues
// http://stackoverflow.com/questions/32978439/d3-clipping-issues-on-zoom
//http://jsfiddle.net/dsummersl/EqLBJ/1/

// Menu
// http://codepen.io/nikhil/pen/sicrK

// Connected data
// http://jsfiddle.net/JVAdams/bTHk2/2/

//http://jsfiddle.net/qy5ohw0x/5/

/*global addMenuEventHandlers:false */
/*global pageManager:false */
/*global document:false */

/*global module:false */
/*global require:false */

import {PageManager} from './pageManager.js';
import {addMenuEventHandlers} from './menuManager.js';


//############################
//
//
//############################
window.onload =  function() {
    "use strict";

    /**
     * 
     * @param qstr
     * @returns {{}}
     */
    function parseQuery(qstr) {
        var query = {};
        var a = qstr.substr(1).split('&');
        for (var i = 0; i < a.length; i++) {
            var b = a[i].split('=');
            query[decodeURIComponent(b[0])] = decodeURIComponent(b[1] || '');
        }
        return query;
    }

    /**
     *
     * @param queryString
     * @returns {string}
     */
    function getInitialExperiment(queryString) {

        var experiment = "expA";

        var queryElements =  parseQuery( queryString);

        if (queryElements.hasOwnProperty("exp")) {
            experiment = queryElements.exp;
            console.log("experiment = " + experiment);
        }

        if (experiment !== "expA" && experiment !== "expB") {
            experiment = "expA";
        }

        return experiment;
    }

    /**
     *
     * @param msg
     * @param url
     * @param line
     * @param col
     * @param error
     * @returns {boolean}
     */
    function handleError(msg, url, line, col, error) {

        // Note that col & error are new to the HTML 5 spec and may not be
        // supported in every browser.  It worked for me in Chrome.
        var extra = !col ? '' : '\ncolumn: ' + col;
        extra += !error ? '' : '\nerror: ' + error;

        console.log("Error: " + msg + "\nurl: " + url + "\nline: " + line + extra);

        var suppressErrorAlert = true;

        // If you return true, then error alerts (like in older versions of
        // Internet Explorer) will be suppressed.
        return suppressErrorAlert;
    }

    /**
     *
     */
    function main() {


        window.onerror = function(msg, url, line, col, error) {
            return handleError(msg, url, line, col, error);
        };

        addMenuEventHandlers();

        var experiment = getInitialExperiment(location.search);

        var pageManager = new PageManager();
        pageManager.init(experiment);

    }

    main();
};
