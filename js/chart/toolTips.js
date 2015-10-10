/**
 *
 * @type {{_toolTip: null, _toolTipFormatter: null, _showTransitionTime: number, _hideTransitionTime: number, _leftOffset: number, _topOffset: number, create: Function, show: Function, hide: Function}}
 */
var toolTip = {

    _toolTip: null,
    _toolTipFormatter: null,
    _showTransitionTime: 200,
    _hideTransitionTime: 500,
    _leftOffset : 20,
    _topOffset: 28,

    /**
     *
     * @param properties
     */
    create: function(properties) {
        "use strict";
        this._toolTipFormatter = properties.formatter;
        this._toolTip =  d3.select("#" + properties.containerID).append("div")
            .attr("class", properties.className);
    },

    /**
     *
     * @param d
     * @param pageX
     * @param pageY
     * @param plotPropIndex
     */
    show: function(d, pageX, pageY, plotPropIndex) {
        "use strict";
        this._toolTip.transition()
            .duration(this._showTransitionTime)
            .style("opacity", 0.9)
            .style("left", (pageX + this._leftOffset) + "px")
            .style("top",  (pageY - this._topOffset) + "px");
        this._toolTip.html(this._toolTipFormatter(d, plotPropIndex));

    },

    /**
     *
     */
    hide: function () {
        "use strict";
        this._toolTip.transition()
            .duration(this._hideTransitionTime)
            .style("opacity", 0);
    }
};
