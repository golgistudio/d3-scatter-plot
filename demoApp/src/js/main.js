/**
 * @file
 */


/*global addMenuEventHandlers:false */
/*global pageManager:false */
/*global document:false */

/*global module:false */
/*global require:false */

import {PageManager} from './pageManager.js';
import {addMenuEventHandlers} from './menuManager.js';


/**
 *
 */
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
