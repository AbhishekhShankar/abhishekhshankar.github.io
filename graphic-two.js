var MARGIN = { top: 10, bottom: 50, left: 65, right: 50 };
var FONT_SIZE = 12;
var PADDING = 1.5;

// New dataset read from CSV
var prescriptionData = [];

// call chartOne function. 
// consider moving this to separate js file with all other charts.
chartTwo();

// Read in the csv file.
function chartTwo() {
    d3.csv("data/SA3_prescription_income_mortality.csv", function(d) {
        return {
            area: d.SA3_name,
            SES: d.SES_quintile,
            presRate: +d.PrescriptionRate,
            income: +d.Median_income,
            mortality: +d.Median_age_at_death,
            remote: d.Remoteness
        };
    }, function(error, rows) {
        prescriptionData = rows;
        console.log(prescriptionData);

        drawScatterPlot();
    });
}


function drawScatterPlot() {

    width = 700 - MARGIN.left - MARGIN.right;
    height = 450 - MARGIN.top - MARGIN.bottom;

    // append the svg object to the body of the page
    var svg = d3.select("#graphic-two")
        .append("svg")
        .attr("width", width + MARGIN.left + MARGIN.right)
        .attr("height", height + MARGIN.top + MARGIN.bottom)
        .append("g")
        .attr("transform", "translate(" + MARGIN.left + "," + MARGIN.top + ")");

    // X axis
    var x = d3.scaleLinear()
        .range([0, width])
        .domain([50, d3.max(prescriptionData, d => d.mortality)])
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .selectAll("text");

    svg.append("text")
        .attr("class", "x label")
        .attr("text-anchor", "end")
        .attr("x", width)
        .attr("y", height - 6)
        .text("AGE AT DEATH");

    svg.append("text")
        .attr("class", "y label")
        .style("text-anchor", "end")
        .attr("transform", "translate(" + MARGIN.left * 1.5 + ")")
        .text("PRESCRIPTION RATE");


    // Add Y axis
    var y = d3.scaleLinear()
        .domain([0, 160000]) //d3.max(prescriptionData, d => d.presRate)
        .range([height, 0]);
    svg.append("g")
        .call(g => g.select(".domain").remove())
        .call(d3.axisLeft(y))


    var z = d3.scaleLinear()
        .domain([30000, 86000])
        .range([1, 12.5]);

    // Add a scale for bubble color
    var myColor = d3.scaleOrdinal()
        .domain(['Major Cities', 'Remote', 'Inner Regional', 'Outer Regoinal'])
        .range(d3.schemeSet1);


    svg.selectAll("circle")
        .data(prescriptionData)
        .enter()
        .append("circle")
        .attr("cx", function(d) { return x(d.mortality); })
        .attr("cy", function(d) { return y(d.presRate); })
        .attr("r", function(d) { return z(d.income); })
        .attr("transform", "translate(" + MARGIN.left / 2 + ")")
        .attr("fill", function(d) { return myColor(d.remote) })
        .attr("opacity", "0.75")
        // .on("hover", function(d) {
        //     tooltip
        //         .style("left", d3.event.pageX - 50 + "px")
        //         .style("top", d3.event.pageY - 70 + "px")
        //         .style("display", "inline-block")
        //         .html("State: " + (d.State) + "<br>" +
        //             "SA3 Area: " + (d.area) + "<br>" +
        //             "Socioeconomic: " + (d.SES));
        // })
        // .on("mouseout", function(d) {
        //     tooltip.style("display", "none");
        // })
        // .on('click', function(d) {
        //     console.log(d);
        // })
        .style("fill", "#black")
        .attr("stroke", "black")


    var gridlines = d3.axisLeft()
        .tickFormat("")
        .tickSize(-(width + MARGIN.left))
        .tickPadding(MARGIN.left)
        .tickSizeOuter([0])
        .ticks(6)
        .scale(y);

    svg.append("g")
        .attr("class", "grid")
        .call(gridlines);


    //Tooltip
    // var tooltip = d3.select("body").append("div").attr("class", "toolTip");

    // var annotations2 = [{
    //         type: d3.annotationCalloutRect,
    //         note: {
    //             label: "Lower rates of opioid prescription",
    //             title: "Richer Areas",
    //             align: "middle", // try right or left
    //             wrap: 200, // try something smaller to see text split in several lines
    //             padding: 10 // More = text lower
    //         },
    //         color: ["#EC29C0"],
    //         x: width,
    //         y: height - height / 4,
    //         // data: { x: "Quintile 5", y: "Melbourne City" },
    //         dy: -150,
    //         dx: -100,
    //         subject: { radius: MARGIN.right, radiusPadding: 2 }
    //     }, {
    //         type: d3.annotationCallout,
    //         note: {
    //             label: "Substantially higher prescription rates",
    //             title: "Poorer areas"
    //         },
    //         color: ["#EC29C0"],
    //         x: MARGIN.left * 2,
    //         y: MARGIN.top * 8,
    //         dy: -10,
    //         dx: 50
    //     }, {
    //         type: d3.annotationCallout,
    //         note: {
    //             label: "Substantially lower prescription rates",
    //             title: "Richer remote areas"
    //         },
    //         color: ["#EC29C0"],
    //         x: MARGIN.left * 4.2,
    //         y: height - MARGIN.bottom,
    //         dy: 15,
    //         dx: 50
    //     }


    // ]

    // // Add annotation to the chart
    // var makeAnnotations2 = d3.annotation()
    //     .type(d3.annotationCalloutCircle)
    //     // .accessors({
    //     //     // x: d => x(d.SES),
    //     //     // y: d => y(d.area)
    //     //     x: function(d) { return x(d.mortality) },
    //     //     y: function(d) { return y(d.area) }
    //     // })
    //     .annotations(annotations2)
    //     // d3.select("svg")
    //     //     .append("g")
    //     //     .call(makeAnnotations)


    // document.fonts.ready.then(function() {
    //     d3.select("svg")
    //         .append("g")
    //         .attr("class", "annotation-group")
    //         .style('font-size', FONT_SIZE)
    //         .call(makeAnnotations2)
    // })



}