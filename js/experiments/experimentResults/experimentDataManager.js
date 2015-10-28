"use strict";

/**
 *
 * @type {{_dataDomains: null, init: Function, calcDomains: Function, mapData: Function}}
 */
function experimentDataManager() {

    var _dataDomains = null;
    var _zoomScaleFactors = null;

    /**
     *
     * @param data
     */
    this.init =  function (data ) {
        this._dataDomains = calcDomains(data);
        this._zoomScaleFactors = initializeZoomFactors();
    };

    function initializeZoomFactors() {
        return {
            yZoomFactors : {
                "yMin": 0.25,
                "yMax": 10
            },
            xZoomFactors :  {
                "xMin": 1,
                "xMax": 1
            }
        };
    }

    /**
     *
     * @param data
     * @returns {{xDomain: Array, yDomain: *[]}}
     */
    function calcDomains (data) {

        var maxY = d3.max(data, function (d) {
            return +d.Incongruent;
        });

        var xDomain = [];
        xDomain.push("");
        data.forEach(function (item) {
            xDomain.push(item.Participant);
        });
        xDomain.push(" ");

        var yDomain = [0, maxY + 5];

        return {"xDomain": xDomain,
                "yDomain": yDomain};
    };

    /**
     *
     * @param d
     * @returns {Array}
     */
    this.mapData = function (d) {

        var item = [];
        item.Participant = d.Participant;
        item.Incongruent = +d.Incongruent;
        item.Congruent = +d.Congruent;
        item.Difference = +d.Difference;
        return item;
    };

};