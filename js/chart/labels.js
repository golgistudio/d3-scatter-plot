"use strict";

/**
 *
 * @param svg
 * @param config
 * @param width
 * @param height
 * @param margin
 */
function drawChartLabels (svg, config, width, height, margin) {


    var titleProperties = {
        "className": config.titleClassName,
        "fontSize" : "16px",
        "labelText" : config.title,
        "textAnchor" : "middle",
        "xPosition" :  (width / 2),
        "yPosition" : -(margin.top / 2) ,
        "transform": ""
    };

    var xAxisLabelProperties = {
        "className": config.xAxisClassName,
        "font-size" : "16px",
        "labelText" : config.xAxisLabel,
        "textAnchor" : "middle",
        "xPosition" :  (width / 2),
        "yPosition" : (height + (margin.top) + (margin.bottom/3)) ,
        "transform": ""
    };

    var yAxisLabelProperties = {
        "className": config.yAxisClassName,
        "font-size" : "16px",
        "labelText" : config.yAxisLabel,
        "textAnchor" : "middle",
        "yPosition" :  (margin.left / 2) - margin.left,
        "xPosition" : -(height / 2),
        "transform": "rotate(-90)"
    };

    drawLabel(svg, titleProperties);
    drawLabel(svg, xAxisLabelProperties);
    drawLabel(svg, yAxisLabelProperties);
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
