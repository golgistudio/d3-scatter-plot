/**
 * @file
 */

/**
 *
 * @constructor
 */
function ToolTipProperties() {
    "uses strict";

    this.containerId  = "";
    this.className  = "tooltip";
    this.formatter  = null;
    this.showTransitionTime  =  200;
    this.hideTransitionTime  = 500;
    this.leftOffset  =  20;
    this.topOffset  = 28;
}

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = ToolTipProperties;
}
