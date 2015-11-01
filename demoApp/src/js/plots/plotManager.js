"use strict";

function PlotManager() {

    /**
     *
     * @param request
     * @param parameters
     */
    this.plotManagerInterface = function (request, parameters) {

        switch(request) {
            case "update" : updatePlots(parameters);
                break;
            case "draw" : drawPlots(parameters);
                break;
            case "drawSelected" : drawSelectedPlot(parameters);
                break;
            case "zoom" : zoomPlots(parameters);
                break;
            case "getPlotRenderer" :
                return getPlotRenderer(parameters);
                break;
        }
    };

    /**
     *
     * @param parameters
     * @returns {*}
     */
    function getPlotRenderer(parameters) {

        if (parameters.plotStyle === "scatter") {
            return new ScatterPlot();
        } else if (parameters.plotStyle === "bar") {
            return new BarChart();
        }
    }

    /**
     *
     * @param zoomParams
     */
    function zoomPlots(zoomParams) {

        zoomParams.plotProperties.forEach(function (configItem) {
            var params = {
                "data":     zoomParams.data,
                "svg":      zoomParams.svg,
                "plotProp": configItem,
                "scales":   zoomParams.scales
            };

            configItem.display.plotRenderer.plotInterface("zoom", params);
        });
    }

    /***
     *
     * @param drawParams
     */
    function drawPlots(drawParams) {

        drawParams.plotProperties.forEach(function (configItem) {
            var params = {
                "data":                 drawParams.data,
                "svg":                  drawParams.svg,
                "plotProp":             configItem,
                "scales":               drawParams.scales,
                "toolTip":              drawParams.toolTip,
                "transitionProperties": drawParams.transitionProperties
            };

            configItem.display.plotRenderer.plotInterface("render", params);
        });
    }


    /**
     *
     * @param drawParams
     */
    function drawSelectedPlot(drawParams) {

        drawParams.plotProperties.forEach(function (configItem) {
            if (configItem.name === drawParams.plotName) {
                var params = {
                    "data":                 drawParams.data,
                    "svg":                  drawParams.svg,
                    "plotProp":             configItem,
                    "scales":               drawParams.scales,
                    "toolTip":              drawParams.toolTip,
                    "transitionProperties": drawParams.transitionProperties
                };
                drawParams.svg.selectAll("." + configItem.plotClassName).data([]).exit().remove();
                configItem.display.plotRenderer.plotInterface("render", params);
            }
        });
    }

    /**
     *
     * @param updateParams
     */
    function updatePlots(updateParams) {

        updateParams.plotProperties.forEach(function (itemProperties) {
            var params = {
                "data":                 updateParams.data,
                "svg":                  updateParams.svg,
                "plotProp":             itemProperties,
                "scales":               updateParams.scales,
                "toolTip":              updateParams.toolTip,
                "transitionProperties": updateParams.transitionProperties
            };

            itemProperties.display.plotRenderer.plotInterface("update", params);

        });

    }

}