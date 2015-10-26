"use strict";

function experimentAnnotations() {

    /**
     *
     * @param d
     * @param plotPropIndex
     * @returns {string}
     */
    this.experimentToolTipContent = function(d, plotPropIndex, yProp) {

        var content = d[plotPropIndex] + "<br/>" + "<br/>";

        if (yProp === "Congruent") {
            content = content + "* ";
        } else {
            content = content + "&nbsp;&nbsp;";
        }
        content = content + "Congruent: " + d.Congruent + " secs";

        if (yProp === "Incongruent" ) {
            content = content + "<br/>* ";
        } else {
            content = content + "<br/>&nbsp;&nbsp;";
        }
        content = content + "Incongruent: " + d.Incongruent + " secs";

        if (yProp === "Difference" ) {
            content = content + "<br/>* ";
        } else {
            content = content + "<br/>&nbsp;&nbsp;";
        }
        content = content + "Difference: " + d.Difference + " secs";

        return content;
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
