/**
 * @file
 */

/*global d3:false */
/*global dataStoreManager:false */
/*jshint unused:true */
/*exported addDotSymbol, updateDotSymbols, zoomDotSymbol */


import {dataStoreManager} from '../../dataStore/dataStoreManager.js';
import {EventMediator} from '../../events/eventMediator.js';
import {eventChannelNames} from '../../events/eventChannelNames.js';
import {dropLinesToAxes} from './scatterSymbolUtils.js';

/**
 *
 * @constructor
 */
export function DotSymbol() {
    "use strict";

    var _name = dataStoreManager.getInstance().generateUUID();
    var _selector = null;

    /**
     *
     * @param plot
     * @param plotProp
     * @param scales
     * @param toolTip
     * @param transitionProperties
     * @returns {*}
     */
    this.addSymbol = function(uuid, plot, parentSVG, plotProp, scales, toolTip, transitionProperties) {


        function hoverStartEventHandler(params) {

            d3.selectAll(_selector).each(function(d) {

                if (d[plotProp.xProp]  === params) {

                    d3.select(this).style("stroke", plotProp.display.hoverColor)
                        .style("stroke-width", plotProp.display.strokeHoverWidth )
                        .style("fill", plotProp.display.hoverColor);
                }

            });

        }

        function hoverEndEventHandler(params) {

            d3.selectAll(_selector).each(function(d) {

                if (d[plotProp.xProp]  === params) {

                    d3.select(this) .style("stroke", plotProp.display.strokeColor)
                        .style("fill", plotProp.display.fillColor)
                        .style("stroke-width", plotProp.display.strokeWidth );
                }

            });

        }


        /**
         *
         * @param d
         * @param that
         */
        function handleHoverStart(d, that) {

            var hoverSize        = plotProp.display.radius * transitionProperties.sizeFactor;

            toolTip.show(d, d3.event.pageX, d3.event.pageY, plotProp.xProp, plotProp.yProp);

            dropLinesToAxes(uuid, d, plotProp, transitionProperties, parentSVG);

            d3.select(that).transition()
                .delay(transitionProperties.hoverDelayTime)
                .duration(transitionProperties.hoverTransitionDuration)
                .style("stroke", plotProp.display.strokeColor)
                .style("stroke-width", plotProp.display.strokeHoverWidth )
                .style("fill", plotProp.display.hoverColor)
                .attr("r", hoverSize)
                .ease("elastic");

            EventMediator.getInstance().notify(eventChannelNames.hoverStart, _name, d[plotProp.xProp]);
        }

        /**
         *
         * @param d
         * @param that
         */
        function handleHoverEnd(d, that) {

            toolTip.hide();

            d3.select(that).transition()
                .delay(transitionProperties.hoverDelayTime)
                .duration(transitionProperties.hoverTransitionDuration)
                .style("stroke", plotProp.display.strokeColor)
                .style("fill", plotProp.display.fillColor)
                .style("stroke-width", plotProp.display.strokeWidth )

                .attr("r", plotProp.display.radius)
                .ease(transitionProperties.hoverEaseType);

            parentSVG.selectAll(".drop-line").data([]).exit().remove();

            EventMediator.getInstance().notify(eventChannelNames.hoverEnd, _name, d[plotProp.xProp]);

        }

        plot = plot.enter().append("circle")
            .attr("class", plotProp.plotClassName)
            .attr("r", plotProp.display.radius)
            .attr("cx", function (d) {
                return scales.xScale(d[plotProp.xProp]);
            })
            .attr("cy", function (d) {
                return scales.yScale(d[plotProp.yProp]);
            });

        plot.style("opacity", "0")
            .style('opacity', 1e-6)
            .transition()
            .style('fill', transitionProperties.enterColor)
            .style('opacity', 1)
            .transition()
            .duration(transitionProperties.startDurationTime)
            .style("stroke", plotProp.display.strokeColor)
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

        _selector = "circle." + plotProp.plotClassName;

        return plot;
    };


    /**
     *
     * @param svg
     * @param plotProp
     * @param scales
     * @param data
     * @param transitionProperties
     * @returns {*}
     */
    this.updateSymbol = function(svg, plotProp, scales, data, transitionProperties) {


        var transitionSize = plotProp.display.radius * transitionProperties.sizeFactor;

        svg.transition()  // Transition from old to new
            .duration(transitionProperties.startDurationTime)  // Length of animation
            .each("start", function () {  // Start animation

                var currentFillColor = d3.select(this).style("fill");
                var transitionColor  = d3.rgb(currentFillColor).brighter();

                d3.select(this)  // 'this' means the current element
                    .style("fill", transitionColor)  // Change color
                    .style("stroke", transitionColor)
                    .attr("r", transitionSize);  // Change size
            })
            .delay(function (d, i) {
                return i / data.length * transitionProperties.delayAdjustment;  // Dynamic delay (i.e. each item delays a little longer)
            })
            .ease(transitionProperties.easeType)  // Transition easing - default 'variable' (i.e. has acceleration), also: 'circle', 'elastic', 'bounce', 'linear'
            .attr("cx", function (d) {
                return scales.xScale(d[plotProp.xProp]);
            })
            .attr("cy", function (d) {
                return scales.yScale(d[plotProp.yProp]);
            })
            .each("end", function () {  // End animation
                d3.select(this)  // 'this' means the current element
                    .transition()
                    .duration(transitionProperties.endDurationTime)
                    .style("fill", plotProp.display.fillColor)  // Change color
                    .style("stroke", plotProp.display.strokeColor)
                    .attr("r", plotProp.display.radius);  // Change radius
            });


        return svg;

    };

    /**
     *
     * @param plot
     * @param plotProp
     * @param scales
     */
    this.zoomSymbol = function(plot, plotProp, scales) {


        plot.selectAll('circle.' + plotProp.plotClassName).attr('cy', function (d) {
            return scales.yScale(d[plotProp.yProp]);
        }).attr('cx', function (d) {
            return scales.xScale(d[plotProp.xProp]);
        });
    };
}

