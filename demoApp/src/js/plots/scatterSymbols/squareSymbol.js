/**
 * @file
 */

/*global d3:false */
/*global dataStoreManager:false */
/*jshint unused:true */
/*exported addSquareSymbol, updateSquareSymbols, zoomSquareSymbol */

import {dropLinesToAxes} from './scatterSymbolUtils.js';
import {dataStoreManager} from '../../dataStore/dataStoreManager.js';
import {EventMediator} from '../../events/eventMediator.js';
import {eventChannelNames} from '../../events/eventChannelNames.js';


/**
 *
 * @constructor
 */
export function SquareSymbol() {

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

            var hoverWidth       = plotProp.display.width * transitionProperties.sizeFactor;
            var hoverHeight      = plotProp.display.height * transitionProperties.sizeFactor;

            toolTip.show(d, d3.event.pageX, d3.event.pageY, plotProp.xProp, plotProp.yProp);

            dropLinesToAxes(uuid, d, plotProp, transitionProperties, parentSVG);

            d3.select(that).transition()
                .delay(transitionProperties.hoverDelayTime)
                .duration(transitionProperties.hoverTransitionDuration)
                .style("stroke", plotProp.display.strokeColor)
                .style("fill", plotProp.display.hoverColor)
                .style("stroke-width", plotProp.display.strokeHoverWidth )
                .attr("width", hoverWidth)
                .attr("height", hoverHeight)
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
                .attr("width", plotProp.display.width)
                .attr("height", plotProp.display.height)
                .ease(transitionProperties.hoverEaseType);

            parentSVG.selectAll(".drop-line").data([]).exit().remove();

            EventMediator.getInstance().notify(eventChannelNames.hoverEnd, _name, d[plotProp.xProp]  );

        }


        plot = plot.enter().append("rect")
            .attr("class", plotProp.plotClassName)
            .attr("width", plotProp.display.width)
            .attr("height", plotProp.display.height)
            .attr("x", function (d) {
                return (scales.xScale(d[plotProp.xProp]) - (plotProp.display.width / 2));
            })
            .attr("y", function (d) {
                return (scales.yScale(d[plotProp.yProp])- (plotProp.display.height / 2));
            });

        plot.style("opacity", "0")
            .transition()
            .style('fill', transitionProperties.enterColor)
            .style('opacity', 1)
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
            .attr("x", function (d) {
                return (scales.xScale(d[plotProp.xProp]) - (plotProp.display.width / 2));
            })
            .attr("y", function (d) {
                return (scales.yScale(d[plotProp.yProp])- (plotProp.display.height / 2));
            })
            .each("end", function () {  // End animation
                d3.select(this)  // 'this' means the current element
                    .transition()
                    .duration(transitionProperties.endDurationTime)
                    .style("fill", plotProp.display.fillColor)  // Change color
                    .attr("width", plotProp.display.width)
                    .attr("height", plotProp.display.height);
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


        plot.selectAll('rect.' + plotProp.plotClassName).attr('y', function (d) {
            return scales.yScale(d[plotProp.yProp]);
        }).attr('x', function (d) {
            return (scales.xScale(d[plotProp.xProp]) - (plotProp.display.width / 2));
        });

    };

}

