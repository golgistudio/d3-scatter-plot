"use strict";

/**
 *
 * @type {{_toolTip: null, _toolTipFormatter: null, _showTransitionTime: number, _hideTransitionTime: number, _leftOffset: number, _topOffset: number, create: Function, show: Function, hide: Function}}
 */
function toolTip() {

    var _toolTip= null,
    _toolTipFormatter= null,
    _showTransitionTime= 200,
    _hideTransitionTime=500,
    _leftOffset = 20,
    _topOffset= 28;

    /**
     *
     * @param properties
     */
    this.create = function(properties) {

        _toolTipFormatter = properties.formatter;
        _toolTip =  d3.select("#" + properties.containerID).append("div")
            .attr("class", properties.className);
    };

    /**
     *
     * @param d
     * @param pageX
     * @param pageY
     * @param plotPropIndex
     */
    this.show = function(d, pageX, pageY, plotPropIndex) {
        "use strict";
        _toolTip.transition()
            .duration(_showTransitionTime)
            .style("opacity", 0.9)
            .style("left", (pageX + _leftOffset) + "px")
            .style("top",  (pageY - _topOffset) + "px");
        _toolTip.html(_toolTipFormatter(d, plotPropIndex));

    };

    /**
     *
     */
    this.hide = function () {
        "use strict";
        _toolTip.transition()
            .duration(_hideTransitionTime)
            .style("opacity", 0);
    }
};
