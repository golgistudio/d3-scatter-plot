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
            .data(data);
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
    updatePlot: function(data, scales, svg, plotProp, toolTip) {
        "use strict";

        var transitionTimes = {
            startDurationTime : 1000,
            delayAdjustment : 500,
            endDurationTime : 500,
            sizeFactor: 2,
            easeType: "bounce"
        };

        var plot = this.setData(svg, data, plotProp.plotClassName);

        svg = this.updateSymbols(data, scales, plot, plotProp, transitionTimes);
        this.removeSymbols(plot, plotProp, scales, data, transitionTimes);
        plot = this.addSymbols(plot, plotProp, scales, toolTip);

    },

    /**
     *
     * @param svg
     * @param plotProp
     * @param scales
     * @param dataset
     * @param transitionTimes
     */
    removeSymbols: function ( svg, plotProp, scales, dataset, transitionTimes) {
        "use strict";

        console.log("remove - " + plotProp.symbol);

        var exitTransitionColor = "red";

        svg = svg.exit();
        svg.style('fill', exitTransitionColor);
        svg.transition().delay(transitionTimes.endDurationTime).remove();


            //.transition()
           // .duration(transitionTimes.endDurationTime)
           // .remove();

        //svg.style('fill', exitTransitionColor);
    },


    updateSymbols: function(data, scales, svg, plotProp, transitionTimes) {

        console.log("update - " + plotProp.symbol);

        var plot = null;

        switch (plotProp.symbol) {
            case "triangle":
                svg = updateTriangleSymbols(svg, plotProp, scales, data, transitionTimes);
                break;
            case "dot" :
                svg = updateDotSymbols(svg, plotProp, scales, data, transitionTimes);
                break;
            case "square":
                svg = updateSquareSymbols(svg, plotProp, scales, data, transitionTimes);
                break;
            case "icon":
                svg = updateIconSymbols(svg, plotProp, scales, data, transitionTimes) ;
                break;
            case "font":
                svg = updateFontAwesomeSymbols(svg, plotProp, scales, data, transitionTimes);
                break;
        }

        return svg;
    }

};




