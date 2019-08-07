var MARGIN = { top: 10, bottom: 50, left: 65, right: 50 };
var FONT_SIZE = 12;
var PADDING = 1.5;

// New dataset read from CSV
var prescriptionData = [];

// call chartOne function. 
// consider moving this to separate js file with all other charts.
chartOne();

// Read in the csv file.
function chartOne() {
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

        drawJitterPlot();
    });
}


function drawJitterPlot() {

    width = 700 - MARGIN.left - MARGIN.right;
    height = 450 - MARGIN.top - MARGIN.bottom;

    // append the svg object to the body of the page
    var svg = d3.select("#graphic-one")
        .append("svg")
        // .attr("preserveAspectRatio", "xMidYMin meet")
        // .attr("viewBox", "0 0 1000 600")
        // // Class to make it responsive.
        // .classed("svg-content-responsive", true)
        // // Fill with a rectangle for visualization.
        // .append("rect")
        // .classed("rect", true)
        // .attr("width", 600)
        // .attr("height", 400)
        // .attr("viewBox", `0 0 950 450`)
        .attr("width", width + MARGIN.left + MARGIN.right)
        .attr("height", height + MARGIN.top + MARGIN.bottom)
        .append("g")
        .attr("transform", "translate(" + MARGIN.left + "," + MARGIN.top + ")");

    // X axis
    var x = d3.scaleBand()
        .range([0, width])
        .domain(prescriptionData.map(function(d) { return d.SES; }))
        .padding(0.05)
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .selectAll("text");

    svg.append("text")
        .attr("class", "x label")
        .attr("text-anchor", "end")
        .attr("x", width)
        .attr("y", height - 6)
        .text("SOCIO-ECONOMIC QUINTILE");

    svg.append("text")
        .attr("class", "y label")
        .style("text-anchor", "end")
        // .attr("y", -6)
        // .attr("dy", ".75em")
        .attr("transform", "translate(" + MARGIN.left * 1.5 + ")")
        // .attr("transform", "translate(0," - MARGIN.bottom + ")")
        .text("PRESCRIPTION RATE");


    // Add Y axis
    var y = d3.scaleLinear()
        .domain([0, 160000]) //d3.max(prescriptionData, d => d.presRate)
        .range([height, 0]);
    svg.append("g")
        .call(g => g.select(".domain").remove())
        .call(d3.axisLeft(y))

    // Features of the histogram
    // var histogram = d3.histogram()
    //     .domain(y.domain())
    //     .thresholds(y.ticks(20)) // Important: how many bins approx are going to be made? It is the 'resolution' of the violin plot
    //     .value(d => d)

    // Compute the binning for each group of the dataset
    // var sumstat = d3.nest() // nest function allows to group the calculation per level of a factor
    //     .key(function(d) { return d.SES; })
    //     .rollup(function(d) { // For each key..
    //         input = d.map(function(g) { return g.presRate; }) // Keep the variable called Sepal_Length
    //         bins = histogram(input) // And compute the binning on it.
    //         return (bins)
    //     })
    //     .entries(prescriptionData)


    // What is the biggest number of value in a bin? We need it cause this value will have a width of 100% of the bandwidth.
    // var maxNum = 0
    // for (i in sumstat) {
    //     allBins = sumstat[i].value
    //     lengths = allBins.map(function(a) { return a.length; })
    //     longest = d3.max(lengths)
    //     if (longest > maxNum) { maxNum = longest }
    // }

    // // The maximum width of a violin must be x.bandwidth = the width dedicated to a group
    // var xNum = d3.scaleLinear()
    //     .range([0, x.bandwidth()])
    //     .domain([-maxNum, maxNum])

    // Add a scale for bubble size
    var z = d3.scaleLinear()
        .domain([30000, 86000])
        .range([1, 12.5]);

    // Add a scale for bubble color
    var myColor = d3.scaleOrdinal()
        .domain(['Major Cities', 'Remote', 'Inner Regional', 'Outer Regoinal'])
        .range(d3.schemeSet1);


    // Add the shape to this svg!
    // svg
    //     .selectAll("myViolin")
    //     .data(sumstat)
    //     .enter() // So now we are working group per group
    //     .append("g")
    //     .attr("transform", function(d) { return ("translate(" + x(d.key) + " ,0)") }) // Translation on the right to be at the group position
    //     .append("path")
    //     .datum(function(d) { return (d.value) }) // So now we are working bin per bin
    //     .style("stroke", "none")
    //     .style("fill", "#69b3a2")
    //     .attr("d", d3.area()
    //         // .x0(xNum(0))
    //         .x0(function(d) { return (xNum(-d.length)) })
    //         .x1(function(d) { return (xNum(d.length)) })
    //         .y(function(d) { return (y(d.x0)) })
    //         .curve(d3.curveCatmullRom) // This makes the line smoother to give the violin appearance. Try d3.curveStep to see the difference
    //     )

    // Add individual points with jitter
    var jitterWidth = 50
        // svg
        //     .selectAll("indPoints")
        //     .data(prescriptionData)
        //     .enter()
        //     .append("circle")
        // .attr("cx", function(d) { return (x(d.SES) + x.bandwidth() / 2 - Math.random() * jitterWidth) })
        //     .attr("cy", function(d) { return (y(d.presRate)) })
        //     .attr("r", function(d) { return z(d.income); })
        //     // .attr("r", 4)
        //     .style("fill", function(d) { return (myColor(d.remote)) })
        //     // .attr("stroke", "white")\
        //     .style("fill", "#black")
        //     .attr("stroke", "black")
        //     .attr("opacity", "0.75")


    // Circles
    svg.selectAll("mycircle")
        .data(prescriptionData)
        // .data(dodge(prescriptionData, function(d) { return z(d.income); }))
        .enter()
        .append("circle")
        // .attr("cx", function(d) { return x(d.SES); })
        .attr("cx", function(d) { return (x(d.SES) + x.bandwidth() / 2 - Math.random() * jitterWidth) })
        .attr("cy", function(d) { return y(d.presRate); })
        .attr("r", function(d) { return z(d.income); })
        // .attr("r", 4)
        // .attr("transform", "translate(0," + width + ")")
        // .attr("transform", "translate(" + MARGIN.left + "," + MARGIN.top + ")")
        .attr("transform", "translate(" + MARGIN.left / 2 + ")")
        .attr("fill", function(d) { return myColor(d.remote) })
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



    // d3.annotation().accessors({
    //     x: d => x(d.SES),
    //     y: d => y(d.SA3_name)
    // })

    // Features of the annotation
    var annotations = [{
            type: d3.annotationCalloutCircle,
            note: {
                label: "Lower rates of opioid prescription",
                title: "Richer Areas",
                align: "middle", // try right or left
                wrap: 200, // try something smaller to see text split in several lines
                padding: 10 // More = text lower
            },
            color: ["#EC29C0"],
            x: width,
            y: height - height / 4,
            // data: { x: "Quintile 5", y: "Melbourne City" },
            dy: -150,
            dx: -100,
            subject: { radius: MARGIN.right, radiusPadding: 2 }
        }, {
            type: d3.annotationCallout,
            note: {
                label: "Substantially higher prescription rates",
                title: "Poorer areas"
            },
            color: ["#EC29C0"],
            x: MARGIN.left * 2,
            y: MARGIN.top * 8,
            dy: -10,
            dx: 50
        }, {
            type: d3.annotationCallout,
            note: {
                label: "Substantially lower prescription rates",
                title: "Richer remote areas"
            },
            color: ["#EC29C0"],
            x: MARGIN.left * 4.2,
            y: height - MARGIN.bottom,
            dy: 15,
            dx: 50
        }


    ]

    // Add annotation to the chart
    var makeAnnotations = d3.annotation()
        .type(d3.annotationCalloutCircle)
        .accessors({
            // x: d => x(d.SES),
            // y: d => y(d.area)
            x: function(d) { return x(d.SES) },
            y: function(d) { return y(d.area) }
        })
        .annotations(annotations)
        // d3.select("svg")
        //     .append("g")
        //     .call(makeAnnotations)


    document.fonts.ready.then(function() {
        d3.select("svg")
            .append("g")
            .attr("class", "annotation-group")
            .style('font-size', FONT_SIZE)
            .call(makeAnnotations)
    })



}