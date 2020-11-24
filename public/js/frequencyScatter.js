const dates = [
    "2020-02-29",
    "2020-03-02",
    "2020-03-06",
    "2020-03-07",
    "2020-03-09",
    "2020-03-10",
    "2020-03-11",
    "2020-03-13",
    "2020-03-14",
    "2020-03-15",
    "2020-03-16",
    "2020-03-17",
    "2020-03-18",
    "2020-03-19",
    "2020-03-20",
    "2020-03-21",
    "2020-03-22",
    "2020-03-23",
    "2020-03-24",
    "2020-03-25",
    "2020-03-26",
    "2020-03-27",
    "2020-03-28",
    "2020-03-29",
    "2020-03-30",
    "2020-04-01",
    "2020-04-03",
    "2020-04-05",
    "2020-04-06",
    "2020-04-07",
    "2020-04-08",
    "2020-04-09",
    "2020-04-10",
    "2020-04-14",
    "2020-04-16",
    "2020-04-17",
    "2020-04-18",
    "2020-04-21",
    "2020-04-22",
    "2020-04-23",
    "2020-04-27",
    "2020-05-05",
    "2020-05-15",
    "2020-05-22",
    "2020-05-29",
    "2020-05-30",
    "2020-07-02",
    "2020-07-20",
    "2020-07-21",
    "2020-07-27",
    "2020-07-28",
    "2020-07-30",
    "2020-08-03",
    "2020-08-05",
    "2020-08-12",
    "2020-08-13",
    "2020-08-23",
    "2020-09-10",
    "2020-09-16",
    "2020-09-23",
    "2020-09-28",
    "2020-10-03",
    "2020-10-05",
    "2020-11-13"
]

const dateParse = d3.timeParse("%Y-%m-%d")

var wordFrequencies = []
var data = []
var visData = []


const margin = {
    left: 50,
    right: 20,
    top: 20,
    bottom: 30
}

const width = 800,
    height = 600

const svg = d3.select("#svg-area").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + ", " + margin.right + ")")

const x = d3.scaleTime().range([0, width])
const y = d3.scaleLinear().range([height, 0])

const xAxis = svg.append("g")
        .attr("transform", "translate(0," + height + ")");
const yAxis = svg.append("g")


const loadData = () => {
    const promises = []
    dates.forEach((date) => {
        promises.push(d3.csv(`data/COUNTS_${date}.txt.csv`))
    })
    
    Promise.all(promises).then((result) => {
        data = result
        wrangleData()
    })
}


const wrangleData = () => {
    const word = d3.select("#word-choice").property("value")
    console.log(word)
    
    var wrangledData = []
    
    data.forEach((d, i) => {
        var sum = 0
        d.forEach((word) => {
            sum += parseInt(word.Frequency)
        })
        
        const entry = d.find(element => element.Word.toLowerCase() == word.toLowerCase())
        var datum = []
        
        datum["date"] = dateParse(dates[i])
        datum["count"] = entry ? parseInt(entry.Frequency) : 0
        datum["frequency"] = entry ? (parseFloat(entry.Frequency) / sum) : 0.0
        datum["word"] = word
        
        wrangledData.push(datum)
    })
    
    visData = wrangledData
    renderVis()
}


const renderVis = () => {
    const minDate = dateParse(dates[0])
    const maxDate = dateParse(dates[dates.length - 1])
    
    const dateScale = x.domain([minDate, maxDate])
    const freqScale = y.domain([0, d3.max(visData, d => d["frequency"])])
    
    svg.selectAll("circle")
            .data(visData)
            .enter()
            .append("circle")
            .attr("r", 3)
            .merge(svg.selectAll("circle").data(visData))
            .attr("cx", d => dateScale(d["date"]))
            .attr("cy", d => freqScale(d["frequency"]))
    
    xAxis.call(d3.axisBottom(dateScale))
    yAxis.call(d3.axisLeft(freqScale))
}

loadData()