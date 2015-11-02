var PlotManager = require("../js/plots/plotManager.js");

describe('plotManager.js', function() {
    describe('constructor', function () {
        it('check construction', function () {
            var   plotManager = new PlotManager();
            should.exist(plotManager);
        });
    });
});