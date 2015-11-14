/**
 * Created by laurie on 11/13/15.
 */


import {dataStoreNames} from '../../dataStore/dataStoreNames.js';
import {dataStoreManager} from '../../dataStore/dataStoreManager.js';

/**
 *
 * @param d
 * @param plotProp
 * @param transitionProperties
 * @param parentSVG
 */
export function dropLinesToAxes(uuid, d, plotProp, transitionProperties, parentSVG) {

    var axes = dataStoreManager.getInstance().getData(uuid, dataStoreNames.axesValues);

    var startY = axes.scales.yScale(d[plotProp.yProp]);
    var endY   = axes.scales.yScale(0);
    var startX = axes.scales.xScale(d[plotProp.xProp]);
    var endX   = 0;

    var lines = [{x1: startX, x2: endX, y1: startY, y2: startY},
        {x1: startX, x2: startX, y1: startY, y2: endY}];

    parentSVG.selectAll("." + transitionProperties.dropLineClassName)
        .data(lines).enter()
        .insert("line", ":nth-child(2)")
        .attr("class", transitionProperties.dropLineClassName)
        .attr("x1", function (ddd) {
            return ddd.x1;
        })
        .attr("x2", function (ddd) {
            return ddd.x2;
        })
        .attr("y1", function (ddd) {
            return ddd.y1;
        })
        .attr("y2", function (ddd) {
            return ddd.y2;
        })
        .style("stroke", transitionProperties.dropLineStrokeColor);
}
