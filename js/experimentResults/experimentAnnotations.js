"use strict";

function experimentAnnotations() {

    /**
     *
     * @param d
     * @param plotPropIndex
     * @returns {string}
     */
    this.experimentToolTipContent = function(d, plotPropIndex) {

        return (d[plotPropIndex] + "<br/>" + "<br/> Congruent:      " + d.Congruent + " secs" +
        "<br/> Incongruent: " + d.Incongruent + " secs" +
        "<br/> Difference:     " + d.Difference + " secs")
    }

    /**
     *
     * @param labelProperties
     */
    this.updateLabelProperties  = function(labelProperties) {
        labelProperties.xAxisLabel = "Participants";
        labelProperties.yAxisLabel = "Time (seconds)";
        labelProperties.title      = "Golgi Lab Study Results";
    }
};
