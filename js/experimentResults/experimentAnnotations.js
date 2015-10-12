/**
 *
 * @param d
 * @param plotPropIndex
 * @returns {string}
 */
function experimentToolTipContent(d, plotPropIndex ) {
    "use strict";

    return (d[plotPropIndex] + "<br/>" + "<br/> Congruent:      " + d.Congruent + " secs" +
        "<br/> Incongruent: " + d.Incongruent + " secs" +
        "<br/> Difference:     " + d.Difference + " secs")
}
