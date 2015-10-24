"use strict";

/**
 *
 * @type {{_dataDomains: null, init: Function, calcDomains: Function, mapData: Function}}
 */
function experimentDataManager() {

    var _dataDomains = null;

    /**
     *
     */
    this.init =  function (data ) {
        this._dataDomains = calcDomains(data);
    };

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

        var yDomain = [-5, maxY + 5];

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