/**
 * @file
 */

/*global module:false */

/**
 *
 * chart  (retrieved by uuid)
 * ~ axes
 * ~ label
 * ~ legend
 * ~ toolTip
 * ~ transition
 * ~ experiment
 * ~ plotProperties (collection of properties)
 */

/**
 *
 * @type {{axes: string, chart: string, labels: string, legend: string, toolTip: string, transition: string, experiment: string, axesValues: string, zoomScaleFactors: string, domains: string}}
 */
var dataStoreNames = {
    axes: "axes",
    chart: "chart",
    labels: "labels",
    legend: "legend",
    toolTip: "toolTip",
    transition: "transition",
    experiment: "experiment",
    axesValues: "axesValues",
    zoomScaleFactors: "zoomScaleFactors",
    domains: "domains"
};

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = dataStoreNames;
}
