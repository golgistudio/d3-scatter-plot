/**
 * @file
 */

/*global module:false */

/**
 *
 * @constructor
 */
function AxesProperties() {
    "uses strict";
    this.yPosition = 6;
    this.xPosition = 6;

    this.xAxis_dx = "-.8em";
    this.xAxis_dy = ".15em";
    this.yAxis_dy = ".72em";

    this.xAxisClassName   = "x axis";
    this.xBorderClassName = "xBorder axis";

    this.yAxisClassName   = "y axis";
    this.yBorderClassName = "yBorder axis";

    this.yAxisClassSelector = ".y.axis";
    this.xAxisClassSelector = ".x.axis";

    this.yTransitionDuration = 500;
    //this.xTransitionDuration = 500;

    this.xScaleRangeStart       = 0;
    this.xScaleRangePointsStart = 0;
    this.yScaleRangePointEnd    = 0;
    this.xOuterTickSize         = 0;
    this.yOuterTickSize         = 0;
    this.xTickPadding           = 10;
    this.yTickPadding           = 10;
    this.yBorderInnerTickSize   = 0;
    this.yBorderOuterTickSize   = 0;

}

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined')
    module.exports = AxesProperties;
else
    window.AxesProperties = AxesProperties;

