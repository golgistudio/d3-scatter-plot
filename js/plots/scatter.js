// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Scatter Plot
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


/**
 *
 * @type {{renderPlot: Function, addSymbols: Function}}
 */
var scatterPlot = {

    renderPlot: function (data, svg, plotProp, scales, toolTip) {
        "use strict";

        var plot = this.setData(svg, data, plotProp.plotClassName);

        plot = this.addSymbols(plot, plotProp, scales, toolTip);


    },

    setData: function (svg, data, plotClassName) {
        return svg.selectAll("." + plotClassName)
            .data(data)
            .enter();
    },

    addSymbols: function (plot, plotProp, scales) {
        "use strict";

        var transitionTimes = {
            startDurationTime : 1000,
            delayAdjustment : 500,
            exitDurationtime : 500
        };

        switch (plotProp.symbol) {
            case "triangle":
                plot = addTriangleSymbol(plot, plotProp, scales, toolTip, transitionTimes);
                break;
            case "dot" :
                plot = addDotSymbol(plot, plotProp, scales, toolTip, transitionTimes);
                break;
            case "square":
                plot = addSquareSymbol(plot, plotProp, scales, toolTip, transitionTimes);
                break;
            case "icon":
                plot = addIconSymbol(plot, plotProp, scales, toolTip, transitionTimes) ;
                break;
            case "font":
                plot = addFontAwesomeSymbol(plot, plotProp, scales, toolTip, transitionTimes);
                break;
        }
        return plot;
    },

    /**
     *
     */
    updatePlot: function(dataset, scales, svg, plotProp) {
        "use strict";

        var transitionTimes = {
                startDurationTime : 1000,
                delayAdjustment : 500,
                exitDurationtime : 500
        };

        // data-join
        var plot = svg.selectAll("circle")
            .data(dataset, function(d) {return d[0]});

        switch (plotProp.symbol) {
            case "triangle":
                svg = updateTriangleSymbols(svg, plotProp, scales, dataset, transitionTimes);
                break;
            case "dot" :
                svg = updateDotSymbols(svg, plotProp, scales, dataset, transitionTimes);
                break;
            case "square":
                svg = updateSquareSymbols(svg, plotProp, scales, dataset, transitionTimes);
                break;
            case "icon":
                svg = updateIconSymbols(svg, plotProp, scales, dataset, transitionTimes) ;
                break;
            case "font":
                svg = updateFontAwesomeSymbols(svg, plotProp, scales, dataset, transitionTimes);
                break;
        }
        return svg;
    }

};



/**
 *
 * @param svg
 * @param plotProp
 * @param scales
 * @param dataset
 * @param transitionTimes
 */
function removeSymbols( svg, plotProp, scales, dataset, transitionTimes) {
    "use strict";

    var exitTransitionColor = "red";

    svg.exit().transition()
        .style('fill', exitTransitionColor)
        .transition()
        .duration(transitionTimes.exitDurationtime)
        .style('opacity', 1e-6)
        .remove();
}

