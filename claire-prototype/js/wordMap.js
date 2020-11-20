/**
 * Constructor for the StoryMap
 */
function WordMap(){
    let self = this;

    self.init();
};

/**
 * Initializes the svg elements required for book spectrum
 */
WordMap.prototype.init = function(){
    let self = this;
    self.margin = {top: 20, right: 175, bottom: 30, left: 175};

    //Gets access to the div element created for this chart from HTML
    let divWordMap = d3.select("#word-maps");
    self.svgBounds = divWordMap.node().getBoundingClientRect();
    self.svgWidth = self.svgBounds.width - self.margin.left - self.margin.right;
    self.svgHeight = self.svgWidth/2;

    //Creates svg element within the div
    self.svg = divWordMap.append("svg")
        .attr("width",self.svgWidth + self.margin.left + self.margin.right)
        .attr("height",self.svgHeight + self.margin.bottom + self.margin.top)
        .append("g")
        .attr("transform", "translate(" + self.margin.left + "," + self.margin.top + ")");

    //Creates box containing the word maps
    self.svg.append("rect")
        .attr("id", "map-box")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", self.svgWidth)
        .attr("height", self.svgHeight);

    //Creates word map divider
    self.svg.append("line")
        .attr("id", "divider")
        .attr("x1", self.svgWidth/2)
        .attr("y1", 0)
        .attr("x2", self.svgWidth/2)
        .attr("y2", self.svgHeight);

    var files = ["../data/mapData1.json", "../data/mapData2.json"];
    var promises = [];
    
    files.forEach(function(url) {
        promises.push(d3.json(url))
    });

    Promise.all(promises).then(function(values) {
        let leftData = values[0];
        let rightData = values[1];

        let leftNodes = leftData.nodes;
        let leftLinks = leftData.links;
        let rightNodes = rightData.nodes;
        let rightLinks = rightData.links;
        // 2b) START RUNNING THE SIMULATION
        var leftSimulation = d3.forceSimulation(leftNodes)
            .force("charge", d3.forceManyBody()
                .strength(-10))
            .force('link', d3.forceLink(leftLinks)
                .distance(100))
            .force("center", d3.forceCenter().x(self.svgWidth/4).y(self.svgHeight/2));
        // 3) DRAW THE LINKS (SVG LINE)
        var leftLink = self.svg.selectAll(".link")
            .data(leftLinks)
            .enter()
            .append("line")
            .attr("class", "link")
            .attr("stroke", "black")
            .attr("stroke-width", 2);
        // 4) DRAW THE NODES (SVG CIRCLE)
        var leftCircle = self.svg.selectAll(".nodeCircle")
            .data(leftNodes)
            .enter()
            .append("circle")
            .attr("class", "nodeCircle")
            .attr("r", 30)
            .attr("fill", "azure");
        var leftNode = self.svg.selectAll(".node")
            .data(leftNodes)
            .enter()
            .append("text")
            .attr("class", "node")
            .attr("text-anchor", "middle")
            .text(function(d) {
                return d.word;
            });
        // 5) LISTEN TO THE 'TICK' EVENT AND UPDATE THE X/Y COORDINATES FOR ALL ELEMENTS
        // Bounded edges: https://gist.github.com/augmt/bff681e44e80f435e068817047923fbb
        leftSimulation.on("tick", function() {
            leftCircle
            .attr("cx", function(d) { return d.x = Math.max(50, Math.min(self.svgWidth/2 - 50, d.x)); })
            .attr("cy", function(d) { return d.y = Math.max(20, Math.min(self.svgHeight - 20, d.y)); });

            // Update node coordinates
            leftNode
                .attr("x", function(d) { return d.x = Math.max(50, Math.min(self.svgWidth/2 - 50, d.x)); })
                .attr("y", function(d) { return d.y = Math.max(20, Math.min(self.svgHeight - 20, d.y)); });

            // Update edge coordinates
            leftLink
                .attr("x1", function(d) { return d.source.x; })
                .attr("y1", function(d) { return d.source.y; })
                .attr("x2", function(d) { return d.target.x; })
                .attr("y2", function(d) { return d.target.y; });
        });
        // Implement draggable nodes
        function dragstart(event, d) {
            if (!event.active) leftSimulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
        }

        function drag(event, d) {
            d.fx = event.x;
            d.fy = event.y;
        }

        function dragend(event, d) {
            if (!event.active) leftSimulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
        }

        leftNode.call(d3.drag()
            .on("start", dragstart)
            .on("drag", drag)
            .on("end", dragend));
    });
}

/**
 * Highlights the selected story
 * @param fillin
 */
WordMap.prototype.update = function(){
    let self = this;

}