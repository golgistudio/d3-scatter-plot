
/*global describe:false */
/*global it:false */

import {AxesProperties} from "../dataStore/properties/axesProperties.js";

describe('axesProperties.js', function() {
    "use strict";

    describe('className', function () {
        it('xAxisClassName should be {x axis}', function () {
            var axesProps = new AxesProperties();
            axesProps.xAxisClassName.should.equal("x axis");
        });
    });
});