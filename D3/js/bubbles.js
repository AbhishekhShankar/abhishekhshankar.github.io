(function() {
	var width = 1000,
		height = 600;

	var svg = d3.select("#chart1")
		.append("svg")
		.attr("height", height)
		.attr("width", width)
		.append("g")
		.attr("transform", "translate(0,0)")
		.call(responsivefy);

	var radiusScale = d3.scaleSqrt()
		.domain([1500, 235000])
		.range([1, 12.5])


	var forceXSeparate = d3.forceX(function(d){
		if(d.SES_quintile === 'Quintile 1') {
			return 150
		} else if(d.SES_quintile === 'Quintile 2'){
			return 325
		} else if(d.SES_quintile === 'Quintile 3'){
			return 525
		} else if(d.SES_quintile === 'Quintile 4') {
			return 700
		} else {
			return 875
		}
		}).strength(0.05)

	var forceXCombine = d3.forceX(width/2).strength(0.02)

	var forceY = d3.forceY(function(d){
		return height/2
	}).strength(0.02)

	var forceCollide = d3.forceCollide(function(d){
			return radiusScale(d.EstResidentPop_30_June_2016) + 3;
		})

	// a collection of forces about where we want our circles to go and how to behave
	var simulation = d3.forceSimulation()
		.velocityDecay(0.4)
		.force("x", forceXCombine)
		.force("y", forceY)
		.force("collide", forceCollide)
		.force("charge", d3.forceManyBody().strength(-2))


	// ready and queue the csv.
	d3.queue()
		.defer(d3.csv, "data/prescriptionsPerSA3_clean.csv")
		.await(ready)

	// Add a color scale for bubbles
    var colorScheme = d3.scaleOrdinal()
	    .domain(["Major Cities", "Outer Regional", "Inner Regional", "Remote"])
	    .range(d3.schemeSet2);

	var tooltip = d3.select("body").append("div").attr("class", "toolTip");


	function ready (error, data) {
		// create circles after reading in the data.
		var circles = svg.selectAll(".area")
			.data(data)
			.enter().append("circle")
			.attr("class", "area")
			.attr("r", function(d) {
				return radiusScale(d.EstResidentPop_30_June_2016)
			})
			.style("fill", function (d) { 
				return colorScheme(d.Remoteness); 
			})
	        .attr("stroke", "black")
	        .style("stroke-width", "1px")
	        .on("mousemove", function(d){
            	tooltip
	              .style("left", d3.event.pageX - 50 + "px")
	              .style("top", d3.event.pageY - 70 + "px")
	              .style("display", "inline-block")
	              .html("State: " + (d.State) + "<br>" + 
	              	"SA3 Area: " + (d.SA3_name_2016) + "<br>" +
	              	"Socioeconomic: " + (d.SES_quintile));
        	})
    		.on("mouseout", function(d){ 
    			tooltip.style("display", "none");
    		})
		    .on('click', function(d){
		    	console.log(d);
		    })

	
	d3.select("#SESbutton").on('click', function(){
		simulation
			.force("x", forceXSeparate)
			.alphaTarget(0.5)
			.restart()
	})

	d3.select("#allAreas").on('click', function(){
		simulation
			.force("x", d3.forceX().strength(0.04).x(width/2))
			.alpha(1)
			.restart()
	})

		simulation.nodes(data)
			.on("tick", ticked)

		function ticked() {
			circles
				.attr("cx", function(d) {
					return d.x
				})
				.attr("cy", function(d) {
					return d.y
				})
		}


	}

}) ();

function responsivefy(svg) {
    // get container + svg aspect ratio
    var container = d3.select(svg.node().parentNode),
        width = parseInt(svg.style("width")),
        height = parseInt(svg.style("height")),
        aspect = width / height;

    // add viewBox and preserveAspectRatio properties,
    // and call resize so that svg resizes on inital page load
    svg.attr("viewBox", "0 0 " + width + " " + height)
        .attr("perserveAspectRatio", "xMinYMid")
        .call(resize);

    // to register multiple listeners for same event type, 
    // you need to add namespace, i.e., 'click.foo'
    // necessary if you call invoke this function for multiple svgs
    // api docs: https://github.com/mbostock/d3/wiki/Selections#on
    d3.select(window).on("resize." + container.attr("id"), resize);

    // get width of container and resize svg to fit it
    function resize() {
        var targetWidth = parseInt(container.style("width"));
        svg.attr("width", targetWidth);
        svg.attr("height", Math.round(targetWidth / aspect));
    }
}