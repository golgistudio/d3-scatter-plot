/*global describe:false */
/*global it:false */
/*global should:false */

import {PlotManager} from "../plots/plotManager.js";

describe('plotManager.js', function() {
    "use strict";

    describe('constructor', function () {
        it('check construction', function () {
            var   plotManager = new PlotManager();
            should.exist(plotManager);
        });
    });
});