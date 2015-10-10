/**
 *
 * @type {{_dataDomains: null, init: Function, calcDomains: Function, mapData: Function}}
 */
var stroopExperiment = {
    _dataDomains: null,

    init: function (experimentParameters ) {
        this._dataDomains = this.calcDomains(experimentParameters.data);
    },

    /**
     *
     * @param data
     * @returns {{xDomain: Array, yDomain: *[]}}
     */
    calcDomains: function (data) {
        "use strict";

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
    },

    /**
     *
     * @param d
     * @returns {Array}
     */
    mapData: function (d) {
        "use strict";

        var item = [];
        item.Participant = d.Participant;
        item.Incongruent = +d.Incongruent;
        item.Congruent = +d.Congruent;
        item.Difference = +d.Difference;
        return item;
    }
};