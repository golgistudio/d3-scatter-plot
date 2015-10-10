/**
 *
 * @param d
 * @param plotPropIndex
 * @returns {string}
 */
function stroopToolTipContent(d, plotPropIndex ) {
    "use strict";

    return (d[plotPropIndex] + "<br/>" + "<br/> Congruent:      " + d.Congruent + " secs" +
        "<br/> Incongruent: " + d.Incongruent + " secs" +
        "<br/> Difference:     " + d.Difference + " secs")
}
