/**
 * @file
 */

/*global d3:false */
/*global dataStoreManager:false */
/*jshint unused:false */
/*exported addTriangleSymbol, updateTriangleSymbols, zoomTriangleSymbol */

import {dataStoreManager} from '../../dataStore/dataStoreManager.js';
import {dropLinesToAxes} from './scatterSymbolUtils.js';
import {EventMediator} from '../../events/eventMediator.js';
import {eventChannelNames} from '../../events/eventChannelNames.js';

/**
 *
 * @constructor
 */
export function TriangleSymbol() {

    "use strict";
    var _name = dataStoreManager.getInstance().generateUUID();
    var _selector = null;

    /**
     * @param plot
     * @param plotProp
     * @param scales
     * @param toolTip
     * @param transitionProperties
     * @returns {*}
     */
    this.addSymbol = function(uuid, plot, parentSVG, plotProp, scales, toolTip, transitionProperties) {


        var symbolType = 'triangle-up';
        var symbol     = d3.svg.symbol().type(symbolType);

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


            var hoverSize = plotProp.display.size * transitionProperties.sizeFactor;

            toolTip.show(d, d3.event.pageX, d3.event.pageY, plotProp.xProp, plotProp.yProp);

            dropLinesToAxes(uuid, d, plotProp, transitionProperties, parentSVG);

            d3.select(that).transition()
                .delay(transitionProperties.hoverDelayTime)
                .duration(transitionProperties.hoverTransitionDuration)
                .style("stroke", plotProp.display.strokeColor)
                .style("fill", plotProp.display.hoverColor)
                .style("stroke-width", plotProp.display.strokeHoverWidth )
                .attr('d', symbol.size(hoverSize))
                .ease(transitionProperties.hoverEaseType);

            EventMediator.getInstance().notify(eventChannelNames.hoverStart, _name, d[plotProp.xProp]  );
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
                .attr("d", symbol.size(plotProp.display.size))
                .ease(transitionProperties.hoverEaseType);

            parentSVG.selectAll(".drop-line").data([]).exit().remove();

            EventMediator.getInstance().notify(eventChannelNames.hoverEnd, _name, d[plotProp.xProp]  );
        }


        plot = plot.enter().append("path")
            .attr("class", plotProp.plotClassName)
            .attr("d", d3.svg.symbol().type("triangle-up"))
            .attr("d", symbol.size(plotProp.display.size))
            .attr("x", function (d) {
                return (scales.xScale(d[plotProp.xProp]) - (plotProp.display.width / 2));
            })
            .attr("transform", function (d) {
                return "translate(" + scales.xScale(d[plotProp.xProp]) + "," + scales.yScale(d[plotProp.yProp]) + ")";
            });

        plot.style("opacity", "0")
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

        _selector = "path." + plotProp.plotClassName;

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



        // Update

        svg.transition()  // Transition from old to new
            .duration(transitionProperties.startDurationTime)  // Length of animation
            .each("start", function (d) {  // Start animation

                var symbolType     = 'triangle-up';
                var symbol     = d3.svg.symbol().type(symbolType);
                var transitionSize = plotProp.display.size * transitionProperties.sizeFactor;

                var currentFillColor = d3.select(this).style("fill");
                var transitionColor  = d3.rgb(currentFillColor).brighter();

                d3.select(this)  // 'this' means the current element
                    .style("fill", transitionColor)  // Change color
                    .attr("d", symbol.size(transitionSize));

            })
            .delay(function (d, i) {
                return i / data.length * transitionProperties.delayAdjustment;  // Dynamic delay (i.e. each item delays a little longer)
            })
            .ease(transitionProperties.easeType)  // Transition easing - default 'variable' (i.e. has acceleration), also: 'circle', 'elastic', 'bounce', 'linear'

            .attr("x", function (d) {
                return (scales.xScale(d[plotProp.xProp]) - (plotProp.display.width / 2));
            })
            .attr("transform", function (d) {
                return "translate(" + scales.xScale(d[plotProp.xProp]) + "," + scales.yScale(d[plotProp.yProp]) + ")";
            })
            .each("end", function () {  // End animation

                var symbolType = 'triangle-up';
                var symbol     = d3.svg.symbol().type(symbolType);

                d3.select(this)  // 'this' means the current element
                    .transition()
                    .duration(transitionProperties.endDurationTime)
                    .style("fill", plotProp.display.fillColor)  // Change color
                    .attr("d", symbol.size(plotProp.display.size));
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


        plot.selectAll('path.' + plotProp.plotClassName).attr("x", function (d) {
                return (scales.xScale(d[plotProp.xProp]) - (plotProp.display.width / 2));
            })
            .attr("transform", function (d) {
                return "translate(" + scales.xScale(d[plotProp.xProp]) + "," + scales.yScale(d[plotProp.yProp]) + ")";
            });
    };

}