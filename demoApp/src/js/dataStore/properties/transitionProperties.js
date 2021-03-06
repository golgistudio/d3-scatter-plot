/**
 * @file
 */

/*global module:false */
/**
 *
 * @constructor
 */
export function TransitionProperties () {
    "uses strict";
    this.startDurationTime = 1000;
    this.delayAdjustment = 500;
    this.endDurationTime = 500;
    this.sizeFactor= 1;
    this.easeType= "bounce";
    this.exitColor= "red";
    this.enterColor= "green";
    this.hoverDelayTime= 10;
    this.hoverTransitionDuration= 1000;
    this.hoverEaseType= "elastic";
    this.dropLineClassName = "drop-line";
    this.dropLineStrokeColor = "orange";
}

