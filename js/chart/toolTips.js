"use strict";

/**
 *
 * @type {{_toolTip: null, _toolTipFormatter: null, _showTransitionTime: number, _hideTransitionTime: number, _leftOffset: number, _topOffset: number, create: Function, show: Function, hide: Function}}
 */
function toolTip() {

    var _toolTip= null,
    _toolTipProperties  = null;

    /**
     *
     * @param properties
     */
    this.create = function(properties) {

        _toolTipProperties = properties;

        _toolTip =  d3.select("#" + _toolTipProperties.containerID).append("div")
            .attr("class", _toolTipProperties.className);
    }

    /**
     *
     * @param d
     * @param pageX
     * @param pageY
     * @param plotPropIndex
     */
    this.show = function(d, pageX, pageY, plotPropIndex, yProp) {

        _toolTip.transition()
            .duration(_toolTipProperties.showTransitionTime)
            .style("opacity", 0.9)
            .style("left", (pageX + _toolTipProperties.leftOffset) + "px")
            .style("top",  (pageY - _toolTipProperties.topOffset) + "px");
        _toolTip.html("<div class=\"toolTipContent\" >" + _toolTipProperties.formatter(d, plotPropIndex, yProp) + "</div>");

    }

    /**
     *
     */
    this.hide = function () {

        _toolTip.transition()
            .duration(_toolTipProperties.hideTransitionTime)
            .style("opacity", 0);
    }
};
