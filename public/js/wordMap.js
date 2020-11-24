/**
 * Constructor for the StoryMap
 */
function WordMap(_files){
    let self = this;

    self.files = _files;

    self.init();
};

/**
 * Initializes the svg elements required for book spectrum
 */
WordMap.prototype.init = function(){
    let self = this;
    self.margin = {top: 20, right: 175, bottom: 30, left: 175};

    //Gets access to the div element created for this chart from HTML
    let divWordMap = d3.select("#word-bubbles");
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

    let promises1 = [];
    let promises2 = [];
    
    self.files[5].forEach(function(url) {
        promises1.push(d3.csv("../../" + url))
    });

    self.files[9].forEach(function(url) {
        promises2.push(d3.csv("../../" + url))
    });

    //https://gist.github.com/sebleier/554280#file-nltk-s-list-of-english-stopwords
    const stopWords = ["donald", "trump", "president", "q", "mr", "dr", "i", "me", "my", "myself", "we", "our", "ours", "ourselves", "you", "your", "yours", "yourself", "yourselves", "he", "him", "his", "himself", "she", "her", "hers", "herself", "it", "its", "itself", "they", "them", "their", "theirs", "themselves", "what", "which", "who", "whom", "this", "that", "these", "those", "am", "is", "are", "was", "were", "be", "been", "being", "have", "has", "had", "having", "do", "does", "did", "doing", "a", "an", "the", "and", "but", "if", "or", "because", "as", "until", "while", "of", "at", "by", "for", "with", "about", "against", "between", "into", "through", "during", "before", "after", "above", "below", "to", "from", "up", "down", "in", "out", "on", "off", "over", "under", "again", "further", "then", "once", "here", "there", "when", "where", "why", "how", "all", "any", "both", "each", "few", "more", "most", "other", "some", "such", "no", "nor", "not", "only", "own", "same", "so", "than", "too", "very", "s", "t", "can", "will", "just", "don", "should", "now"];

    Promise.all(promises1).then(function(month1Data) {
        Promise.all(promises2).then(function(month2Data) {
            let wordMap1 = new Map();
            let wordMap2 = new Map();
            let topWords1 = [];
            let topWords2 = [];
            month1Data.forEach(function(dayData) {
                //Get map of all word frequencies for the first chosen month
                for(let wordData of dayData) {
                    let word = wordData.Word;
                    let frequency = +wordData.Frequency;
                    if(!stopWords.includes(word.toLowerCase())){
                        if(wordMap1.get(word)) {
                            wordMap1.set(word, wordMap1.get(word)+frequency);
                        }
                        else {
                            wordMap1.set(word, frequency);
                        }    
                    }
                }
            });
            month2Data.forEach(function(dayData) {
                //Get map of all word frequencies for the second chosen month
                for(let wordData of dayData) {
                    let word = wordData.Word;
                    let frequency = +wordData.Frequency;
                    if(!stopWords.includes(word.toLowerCase())){
                        if(wordMap2.get(word)) {
                            wordMap2.set(word, wordMap2.get(word)+frequency);
                        }
                        else {
                            wordMap2.set(word, frequency);
                        }       
                    }          
                }
            });
            //Get top words for each month
            wordMap1.forEach(function(value, key, map) {
                topWords1.push({"word": key, "frequency": value});
            });
            topWords1.sort(function(a, b) {
                return b.frequency - a.frequency;
            });
            wordMap2.forEach(function(value, key, map) {
                topWords2.push({"word": key, "frequency": value});
            });
            topWords2.sort(function(a, b) {
                return b.frequency - a.frequency;
            });
            topWords1 = topWords1.slice(0, 15);
            topWords2 = topWords2.slice(0, 15);

            //Create scales
            const radiusScale = d3.scaleSqrt()
                .domain([0, Math.max(d3.max(topWords1, function(d) {
                    return d.frequency;
                }), d3.max(topWords2, function(d) {
                    return d.frequency;
                }))])
                .range([0, 70]);
                
            divWordMap.append("button")
                .text("Filter")
                .on("click", function() {
                    self.update(topWords2, radiusScale);
                });

            //Create left visualization
            let simulation = d3.forceSimulation(topWords1)
                .force("charge", d3.forceManyBody()
                    .strength(-30))
                .force("center", d3.forceCenter().x(self.svgWidth/4).y(self.svgHeight/2))
                .force('collision', d3.forceCollide().radius(function(d) {
                    return radiusScale(d.frequency);
                }));

            let leftNodes = self.svg.selectAll(".left-node")
                .data(topWords1)
                .enter()
                .append("circle")
                .attr("class", "node left-node")
                .attr('r', function(d) {
                    return radiusScale(d.frequency);
                });

            var leftText = self.svg.selectAll(".left-text")
                .data(topWords1)
                .enter()
                .append("text")
                .attr("class", "text left-text")
                .text(function(d) {
                    return d.word;
                });

            simulation.on("tick", function() {
                // Update node coordinates
                leftNodes
                    .attr("cx", function(d) { return d.x = Math.max(70, Math.min(self.svgWidth/2 - 70, d.x)); })
                    .attr("cy", function(d) { return d.y = Math.max(70, Math.min(self.svgHeight - 70, d.y)); });

                leftText
                    .attr("x", function(d) { return d.x = Math.max(70, Math.min(self.svgWidth/2 - 70, d.x)); })
                    .attr("y", function(d) { return d.y = Math.max(25, Math.min(self.svgHeight - 25, d.y+5)); });
            });
            // Implement draggable nodes
            function dragstart(event, d) {
                if (!event.active) simulation.alphaTarget(0.3).restart();
                d.fx = d.x;
                d.fy = d.y;
            }
            
            function drag(event, d) {
                d.fx = event.x;
                d.fy = event.y;
            }
            
            function dragend(event, d) {
                if (!event.active) simulation.alphaTarget(0);
                d.fx = null;
                d.fy = null;
            }
            
            leftNodes.call(d3.drag()
                .on("start", dragstart)
                .on("drag", drag)
                .on("end", dragend));
        });
    });
}

/**
 * Highlights the selected story
 * @param fillin
 */
WordMap.prototype.update = function(newWordData, radiusScale){
    let self = this;

    let newWords = [];
    newWordData.forEach(function(d) {
        newWords.push(d.word);
    });

    let simulation = d3.forceSimulation(newWordData)
        .force("charge", d3.forceManyBody()
            .strength(-30))
            .force("center", d3.forceCenter().x(3*self.svgWidth/4).y(self.svgHeight/2))
            .force('collision', d3.forceCollide().radius(function(d) {
                return radiusScale(d.frequency);
            }));

    let oldNodes = self.svg.selectAll(".left-node");

    let repeatWords = [];
    oldNodes
        .each(function(d) {
            if(newWords.includes(d.word)) {
                repeatWords.push(d.word);
                d3.select(this).transition().duration(100).style("fill", "lightgray");
            }
        });

    let newNodes = self.svg.selectAll(".new-node")
        .data(newWordData)
        .enter()
        .append("circle")
        .attr("class", "node new-node")
        .attr('r', function(d) {
            return radiusScale(d.frequency);
        })
        .style("fill", function(d) {
            if(repeatWords.includes(d.word)){
                return "darkcyan";
            }
            return "salmon";
        });

    var newText = self.svg.selectAll(".new-text")
        .data(newWordData)
        .enter()
        .append("text")
        .attr("class", "text new-text")
        .text(function(d) {
            return d.word;
        });

    simulation.on("tick", function() {
        // Update node coordinates
        newNodes
            .attr("cx", function(d) { return d.x = Math.max(70+self.svgWidth/2, Math.min(self.svgWidth - 70, d.x)); })
            .attr("cy", function(d) { return d.y = Math.max(70, Math.min(self.svgHeight - 70, d.y)); });

        newText
            .attr("x", function(d) { return d.x = Math.max(70+self.svgWidth/2, Math.min(self.svgWidth - 70, d.x)); })
            .attr("y", function(d) { return d.y = Math.max(25, Math.min(self.svgHeight - 25, d.y+5)); });
    });
    // Implement draggable nodes
    function dragstart(event, d) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }
    
    function drag(event, d) {
        d.fx = event.x;
        d.fy = event.y;
    }
    
    function dragend(event, d) {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }
    
    newNodes.call(d3.drag()
        .on("start", dragstart)
        .on("drag", drag)
        .on("end", dragend));
}