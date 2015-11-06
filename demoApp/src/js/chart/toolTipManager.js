/**
 * @file
 */

/*global d3:false */


/*global module:false */

/**
 *
 * @constructor
 */
function ToolTipManager() {
    "use strict";

    var _toolTip= null,
    _toolTipProperties  = null;

    /**
     *
     * @param properties
     */
    this.create = function(properties) {

        _toolTipProperties = properties;

        _toolTip =  d3.select("#" + _toolTipProperties.containerId).append("div")
            .attr("class", _toolTipProperties.className);
    };

    /**
     *
     * @param d
     * @param pageX
     * @param pageY
     * @param plotPropIndex
     * @param yProp
     */
    this.show = function(d, pageX, pageY, plotPropIndex, yProp) {

        _toolTip.transition()
            .duration(_toolTipProperties.showTransitionTime)
            .style("opacity", 0.9)
            .style("left", (pageX + _toolTipProperties.leftOffset) + "px")
            .style("top",  (pageY - _toolTipProperties.topOffset) + "px");
        _toolTip.html("<div class=\"toolTipContent\" >" + _toolTipProperties.formatter(d, plotPropIndex, yProp) + "</div>");

    };

    /**
     *
     */
    this.hide = function () {

        _toolTip.transition()
            .duration(_toolTipProperties.hideTransitionTime)
            .style("opacity", 0);
    };
}

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = ToolTipManager;
}
