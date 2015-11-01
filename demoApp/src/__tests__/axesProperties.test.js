var AxesProperties = require("../js/dataStore/properties/axesProperties.js");

describe('axesProperties.js', function() {
    describe('className', function () {
        it('xAxisClassName should be {x axis}', function () {
            var axesProps = new AxesProperties();
            axesProps.xAxisClassName.should.equal("x axis");
        });
    });
});