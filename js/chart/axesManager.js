/**
 * Created by laurie on 10/24/15.
 */

function axesManager() {

    /**
     * ToDo - Use Factory to create axes
     * ToDo - Extract out properties.
     *
     * @param domains
     * @param width
     * @param height
     * @returns {{xAxis=*, yAxis=*, topBorder=*, rightBorder=*}}
     */
    this.createAxes = function (domains, width, height) {

        // Properties - ToDo - Extract out
        var xScaleRangeStart       = 0;
        var xScaleRangePointsStart = 0;
        var yScaleRangePointEnd    = 0;
        var xOuterTickSize         = 0;
        var yOuterTickSize         = 0;
        var xTickPadding           = 10;
        var yTickPadding           = 10;
        var yBorderInnerTickSize   = 0;
        var yBorderOuterTickSize   = 0;

        // Create x scale
        // For this example it is ordinal
        var xScale = d3.scale.ordinal()
            .range([xScaleRangeStart, width])
            .rangePoints([xScaleRangePointsStart, width])
            .domain(domains.xDomain);

        // Create y scale
        // For this example it is linear
        var yScale = d3.scale.linear()
            .range([height, yScaleRangePointEnd])
            .domain(domains.yDomain);

        // Create x axis
        var xAxis = d3.svg.axis()
            .scale(xScale)
            .orient("bottom")
            .innerTickSize(-height)
            .outerTickSize(xOuterTickSize)
            .tickPadding(xTickPadding);

        // Create y axis
        var yAxis = d3.svg.axis()
            .scale(yScale)
            .orient("left")
            .innerTickSize(-width)
            .outerTickSize(yOuterTickSize)
            .tickPadding(yTickPadding);

        // Create border around the rest of the Chart
        var topBorder = d3.svg.axis()
            .scale(xScale)
            .orient("top")
            .tickValues(0);

        var rightBorder = d3.svg.axis()
            .scale(yScale)
            .orient("right")
            .innerTickSize(yBorderInnerTickSize)
            .outerTickSize(yBorderOuterTickSize)
            .tickPadding(xTickPadding);

        return {
            'xAxis':       xAxis,
            'yAxis':       yAxis,
            'topBorder':   topBorder,
            'rightBorder': rightBorder,
            'scales' : {
                'yScale': yScale,
                'xScale': xScale
            }
        };
    };

    /**
     *
     * @param svg
     * @param axes
     * @param width
     * @param height
     * @returns {*}
     */
    this.drawAxes = function  (svg, axes, width, height) {


        var yPosition = 6;
        var xPosition = 6;

        var xAxis_dx = "-.8em";
        var xAxis_dy = ".15em";
        var yAxis_dy = ".72em";

        var xAxisClassName = "x axis";
        var xBorderClassName = "xBorder axis";

        var yAxisClassName = "y axis";
        var yBorderClassName = "yBorder axis";

        // Add the x axis
        svg.append("g")
            .attr("class", xAxisClassName)
            .attr("transform", "translate(0," + height + ")")
            .call(axes.xAxis)
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", xAxis_dx)
            .attr("dy", xAxis_dy)
            .attr("transform", "rotate(-50)");

        // Add the x border
        svg.append("g")
            .attr("class", xAxisClassName)
            .call(axes.topBorder);

        // Add the y axis
        svg.append("g")
            .attr("class", "y axis")
            .call(axes.yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", yPosition)
            .attr("dy", yAxis_dy)
            .style("text-anchor", "end");

        // Add the y border
        svg.append("g")
            .attr("class", yBorderClassName)
            .call(axes.rightBorder)
            .attr("transform", "translate(" + width + " ,0)")
            .attr("y", xPosition)
            .attr("dy", yAxis_dy);

        return svg;
    };

    /**
     *
     * @param svg
     * @param axes
     * @param width
     * @param height
     * @returns {*}
     */
    this.updateAxes = function  (svg, axes) {


        var yTransitionDuration = 500;
        var xTransitionDuration = 500;
        var xAxis_dx = "-.8em";
        var xAxis_dy = ".15em";

        if (axes.hasOwnProperty("xAxis")) {
            // Update X Axis
            svg.select(".x.axis")
                .transition()
                .duration(yTransitionDuration)
                .call(axes.xAxis)
                .selectAll("text")
                .style("text-anchor", "end")
                .attr("dx", xAxis_dx)
                .attr("dy", xAxis_dy)
                .attr("transform", "rotate(-50)");
        }

        if (axes.hasOwnProperty("yAxis")) {

            // Update Y Axis
            svg.select(".y.axis")
                .transition()
                .duration(xTransitionDuration)
                .call(axes.yAxis);
        }

        return svg;

    };

};