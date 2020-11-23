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

    let promises1 = [];
    let promises2 = [];
    
    self.files[5].forEach(function(url) {
        promises1.push(d3.csv("../../" + url))
    });

    self.files[9].forEach(function(url) {
        promises2.push(d3.csv("../../" + url))
    });

    Promise.all(promises1).then(function(month1Data) {
        Promise.all(promises2).then(function(month2Data) {
            let wordMap1 = new Map();
            let wordMap2 = new Map();
            let topWords1 = []
            let topWords2 = [];
            month1Data.forEach(function(dayData) {
                //Get map of all word frequencies for the first chosen month
                for(let wordData of dayData) {
                    let word = wordData.Word;
                    let frequency = +wordData.Frequency;
                    if(wordMap1.get(word)) {
                        wordMap1.set(word, wordMap1.get(word)+frequency);
                    }
                    else {
                        wordMap1.set(word, frequency);
                    }                 
                }
            });
            month2Data.forEach(function(dayData) {
                //Get map of all word frequencies for the second chosen month
                for(let wordData of dayData) {
                    let word = wordData.Word;
                    let frequency = +wordData.Frequency;
                    if(wordMap2.get(word)) {
                        wordMap2.set(word, wordMap2.get(word)+frequency);
                    }
                    else {
                        wordMap2.set(word, frequency);
                    }                 
                }
            });
            // wordMap1.sort(function(a, b) {
            //     return b.value - a.value;
            // })
            // console.log(wordMap1);
        }); 
    });
}

/**
 * Highlights the selected story
 * @param fillin
 */
WordMap.prototype.update = function(){
    let self = this;

}