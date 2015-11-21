/**
 * @file
 */

/*global module:false */
/*global require:false */
/*global d3:false */
/*global dataStoreManager:false */
/*global dataStoreNames:false */
/*exported BarChart */


import {dataStoreNames} from '../dataStore/dataStoreNames.js';
import {dataStoreManager} from '../dataStore/dataStoreManager.js';
import {EventMediator} from '../events/eventMediator.js';
import {eventChannelNames} from '../events/eventChannelNames.js';


/**
 *
 * @constructor
 */
export function BarChart() {
    "use strict";

    var _name = dataStoreManager.getInstance().generateUUID();
    var _selector = null;


    /**
     *
     * @param svg
     * @param data
     * @param plotClassName
     * @returns {*}
     */
    function setData(svg, data, plotClassName) {

        return svg.selectAll("." + plotClassName).data(data);
    }


    /**
     *
     * @param uuid
     * @param plot
     * @param plotProp
     * @param scales
     * @param toolTip
     * @param transitionProperties
     * @returns {*}
     */
    function addElements(uuid, plot, plotProp, scales, toolTip, transitionProperties) {

        function hoverStartEventHandler(params) {

            d3.selectAll(_selector).each(function(d) {

                if (d[plotProp.xProp]  === params) {

                    d3.select(this).style("stroke", plotProp.display.hoverColor)
                        .style("fill", plotProp.display.hoverColor)
                        .style("stroke-width", plotProp.display.strokeHoverWidth );
                }

            });

        }

        function hoverEndEventHandler(params) {

            d3.selectAll(_selector).each(function(d) {

                if (d[plotProp.xProp]  === params) {

                    d3.select(this) .style("stroke", plotProp.display.strokeColor)
                        .style("stroke-width", plotProp.display.strokeWidth )
                        .style("fill", plotProp.display.fillColor);
                }

            });

        }


        /**
         *
         * @param d
         * @param that
         */
        function handleHoverStart(d, that) {

            toolTip.show(d, d3.event.pageX, d3.event.pageY, plotProp.xProp, plotProp.yProp);

           // var currentFillColor = d3.select(that).style("fill");
           // var hoverFillColor   = d3.rgb(currentFillColor).darker();
            var hoverWidth       = plotProp.display.width * transitionProperties.sizeFactor;

            var axes = dataStoreManager.getInstance().getData(uuid, dataStoreNames.axesValues);

            d3.select(that).transition()
                .delay(transitionProperties.hoverDelayTime)
                .duration(transitionProperties.hoverTransitionDuration)
                .style("stroke",  plotProp.display.strokeColor)
                .style("fill", plotProp.display.hoverColor)
                .style("stroke-width", plotProp.display.strokeHoverWidth )
                .attr("width", hoverWidth)
                .attr("height", function () {
                    return Math.abs(axes.scales.yScale(d[plotProp.yProp]) - axes.scales.yScale(0));
                })
                .ease(transitionProperties.hoverEaseType);

            EventMediator.getInstance().notify(eventChannelNames.hoverStart, _name, d[plotProp.xProp] );

        }

        /**
         *
         * @param d
         * @param that
         */
        function handleHoverEnd(d, that) {



            var axes = dataStoreManager.getInstance().getData(uuid, dataStoreNames.axesValues);

            toolTip.hide();
            d3.select(that).transition()
                .delay(transitionProperties.hoverDelayTime)
                .duration(transitionProperties.hoverTransitionDuration)
                .style("stroke", plotProp.display.strokeColor)
                .style("fill", plotProp.display.fillColor)
                .style("stroke-width", plotProp.display.strokeWidth )
                .attr("width", plotProp.display.width)
                .attr("height", function (d) {
                    return Math.abs(axes.scales.yScale(d[plotProp.yProp]) - axes.scales.yScale(0));
                })
                .ease(transitionProperties.hoverEaseType);

            EventMediator.getInstance().notify(eventChannelNames.hoverEnd, _name, d[plotProp.xProp] );

        }

        plot = plot.enter().append("rect")
            .attr("class", plotProp.plotClassName)
            .attr("width", plotProp.display.width)
            .attr("height", function (d) {
                return Math.abs(scales.yScale(d[plotProp.yProp]) - scales.yScale(0));
            })
            .attr("x", function (d) {
                return (scales.xScale(d[plotProp.xProp]) - (plotProp.display.width / 2));
            })
            .attr("y", function (d) {
                return scales.yScale(0) - Math.abs(scales.yScale(d[plotProp.yProp]) - scales.yScale(0));
            });

        plot.style("opacity", "0")
            .style('opacity', 1e-6)
            .transition()
            .style('fill', transitionProperties.enterColor)
            .style('opacity', 1.0)
            .transition()
            .style('stroke', plotProp.display.strokeColor)
            .duration(transitionProperties.startDurationTime)
            .style("fill", function () {
                return plotProp.display.fillColor;
            });

        plot.on("mouseover", function (d) {
                handleHoverStart(d, this);
            })
            .on("mouseout", function (d) {
                handleHoverEnd(d, this);
            })
            .on("touchstart", function (d) {
                handleHoverStart(d, this);
            })
            .on("touchend", function (d) {
                handleHoverEnd(d, this);
            });

        EventMediator.getInstance().register(eventChannelNames.hoverStart, _name, hoverStartEventHandler);
        EventMediator.getInstance().register(eventChannelNames.hoverEnd, _name, hoverEndEventHandler);

        _selector = "rect." + plotProp.plotClassName;

        return plot;
    }


    /**
     *
     * @param parameters
     */
    function renderPlot(parameters) {

        var plot = setData(parameters.svg, parameters.data, parameters.plotProp.plotClassName);

        addElements(parameters.uuid, plot, parameters.plotProp, parameters.scales, parameters.toolTip, parameters.transitionProperties);

    }


    /**
     *
     * @param svg
     * @param data
     * @param scales
     * @param plotProp
     * @param transitionProperties
     * @returns {*}
     */
    function updateElements(svg, data, scales, plotProp, transitionProperties) {

        svg.transition()  // Transition from old to new
            .duration(transitionProperties.startDurationTime)  // Length of animation
            .each("start", function () {  // Start animation
                var currentFillColor = d3.select(this).style("fill");
                var transitionColor  = d3.rgb(currentFillColor).brighter();
                d3.select(this)  // 'this' means the current element
                    .style("fill", transitionColor)  // Change color
                    .attr("width", plotProp.display.width * transitionProperties.sizeFactor)
                    .attr("height", plotProp.display.height * transitionProperties.sizeFactor);
            })
            .delay(function (d, i) {
                return i / data.length * transitionProperties.delayAdjustment;  // Dynamic delay (i.e. each item delays a little longer)
            })
            .ease(transitionProperties.easeType)  // Transition easing - default 'variable' (i.e. has acceleration), also: 'circle', 'elastic', 'bounce', 'linear'
            .attr("height", function (d) {
                return Math.abs(scales.yScale(d[plotProp.yProp]) - scales.yScale(0));
            })
            .attr("x", function (d) {
                return (scales.xScale(d[plotProp.xProp]) - (plotProp.display.width / 2));
            })
            .attr("y", function (d) {
                return scales.yScale(0) - Math.abs(scales.yScale(d[plotProp.yProp]) - scales.yScale(0));
            })
            .each("end", function () {  // End animation
                d3.select(this)  // 'this' means the current element
                    .transition()
                    .duration(transitionProperties.endDurationTime)
                    .style("fill", plotProp.display.fillColor)  // Change color
                    .attr("width", plotProp.display.width)
                    .attr("height", function (d) {
                        return Math.abs(scales.yScale(d[plotProp.yProp]) - scales.yScale(0));
                    })
                    .attr("x", function (d) {
                        return (scales.xScale(d[plotProp.xProp]) - (plotProp.display.width / 2));
                    })
                    .attr("y", function (d) {
                        return scales.yScale(0) - Math.abs(scales.yScale(d[plotProp.yProp]) - scales.yScale(0));
                    });
            });

        return svg;
    }


    function zoomElements(plot, plotProp, scales) {


        plot.selectAll('rect.' + plotProp.plotClassName).attr("height", function (d) {
                return Math.abs(scales.yScale(d[plotProp.yProp]) - scales.yScale(0));
            })
            .attr("x", function (d) {
                return (scales.xScale(d[plotProp.xProp]) - (plotProp.display.width / 2));
            })
            .attr("y", function (d) {
                return scales.yScale(0) - Math.abs(scales.yScale(d[plotProp.yProp]) - scales.yScale(0));
            });
    }

    /**
     *
     * @param parameters
     */
    function zoomPlot(parameters) {

        zoomElements(parameters.svg, parameters.plotProp, parameters.scales);
    }


    /**
     *
     * @param svg
     * @param transitionProperties
     */
    function removeElements(svg, transitionProperties) {

        svg = svg.exit();
        svg.style('fill', transitionProperties.exitColor);
        svg.transition().delay(transitionProperties.endDurationTime).remove();

    }

    /**
     *
     * @param parameters
     */
    function updatePlot(parameters) {

        var plot = setData(parameters.svg, parameters.data, parameters.plotProp.plotClassName);

        updateElements(plot, parameters.data, parameters.scales, parameters.plotProp, parameters.transitionProperties);
        addElements(parameters.uuid, plot, parameters.plotProp, parameters.scales, parameters.toolTip, parameters.transitionProperties);
        removeElements(plot, parameters.transitionProperties);

    }



    /**
     *
     * @param request
     * @param parameters
     */
    this.plotInterface = function (request, parameters) {

        switch (request) {
            case "render" :
                renderPlot(parameters);
                break;
            case "update" :
                updatePlot(parameters);
                break;
            case "zoom" :
                zoomPlot(parameters);
                break;

        }
    };
}