/**
 * @file
 */


/*global module:false */

/**
 *
 * @constructor
 */
export function LabelManager() {

    /**
     *
     * @param svg
     * @param properties
     */
    function drawLabel(svg, properties) {
        "use strict";

        svg.append("text")
            .attr("class", properties.className)
            .attr("text-anchor", properties.textAnchor)
            .attr("x", properties.xPosition)
            .attr("y", properties.yPosition)
            .attr("transform", properties.transform)
            .attr("font-size", properties.fontSize)
            .text(properties.labelText);
    }

    /**
     *
     * @param svg
     * @param labelProps
     * @param width
     * @param height
     * @param margin
     */
    this.drawChartLabels = function(svg, labelProps, width, height, margin) {
        "use strict";

        labelProps.titleProperties.xPosition = (width / 2);
        labelProps.titleProperties.yPosition = -(margin.top / 2);

        labelProps.xAxisLabelProperties.xPosition = (width / 2);
        labelProps.xAxisLabelProperties.yPosition = (height + (margin.top) + (margin.bottom / 3));


        labelProps.yAxisLabelProperties.yPosition = (margin.left / 2) - margin.left;
        labelProps.yAxisLabelProperties.xPosition = -(height / 2);
        drawLabel(svg, labelProps.titleProperties);
        drawLabel(svg, labelProps.xAxisLabelProperties);
        drawLabel(svg, labelProps.yAxisLabelProperties);
    }
}



