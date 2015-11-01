"use strict";

/**
 *
 * @param svg
 * @param config
 * @param width
 * @param height
 * @param margin
 */
function drawChartLabels (svg, labelProps, width, height, margin) {

    labelProps.titleProperties.xPosition =  (width / 2);
    labelProps.titleProperties.yPosition =  -(margin.top / 2);

    labelProps.xAxisLabelProperties.xPosition =  (width / 2);
    labelProps.xAxisLabelProperties.yPosition =  (height + (margin.top) + (margin.bottom / 3));


    labelProps.yAxisLabelProperties.yPosition =  (margin.left / 2) - margin.left;
    labelProps.yAxisLabelProperties.xPosition =   -(height / 2);
    drawLabel(svg, labelProps.titleProperties);
    drawLabel(svg, labelProps.xAxisLabelProperties);
    drawLabel(svg, labelProps.yAxisLabelProperties);
};

/**
 *
 * @param svg
 * @param properties
 */
function drawLabel(svg, properties) {

    svg.append("text")
        .attr("class", properties.className)
        .attr("text-anchor", properties.textAnchor)
        .attr("x", properties.xPosition)
        .attr("y", properties.yPosition)
        .attr("transform", properties.transform)
        .attr("font-size", properties.fontSize)
        .text(properties.labelText);
}  ;
