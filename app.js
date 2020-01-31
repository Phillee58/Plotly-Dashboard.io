// Define the function to build the data from samples.json
function buildMetaData(sample){

// Function that builds the metadata panel usind d3
d3.json("./samples.json").then(function(data){

  // Use d3 to select the panel with id of `#sample-metadata` and default first id
      var sample_metadata = d3.select("#sample-metadata");
      var metadata = data.metadata;
      var result = metadata.filter(sampleobj => sampleobj.id==sample)[0]
  
  // Use `.html("") to clear any existing metadata
      sample_metadata.html("");
      
  // Use `Object.entries` to add each key and value pair to the panel
      Object.entries(result).forEach(([key, value]) => {

        var row = sample_metadata.append("p");
        row.text(`${key}: ${value}`);
        console.log(result);
      })
    });
}

// Define the function to build the charts
function buildCharts(sample) {
  
  // Fetch the sample data for the plots
  d3.json("./samples.json").then(function(data){
    var samples = data.samples;
    var result = samples.filter(sampleobj => sampleobj.id==sample)[0]

  // Build the BUBBLE plot
      var xValues = result.otu_ids;
      var yValues = result.sample_values;
      var mSize = result.sample_values;
      var mClrs = result.otu_ids;
      var tValues = result.otu_values;
      
      var trace_bubble = {
        x: xValues,
        y: yValues,
        text: tValues,
        mode: 'markers',
        marker: {
          size: mSize,
          color: mClrs
        }
      };
  
      var data = [trace_bubble];
      var layout = {
        xaxis: {title: "OTU ID"}
      };
  
      Plotly.newPlot('bubble', data, layout)

// Build the BAR plot
var barValue = result.sample_values;
var xValues = result.otu_values;
var barLabel = result.otu_ids; // NOT WORKING
var barHover = result.otu_labels;

// create trace variable for the plot
  var trace = {
    x: barValue.slice(0, 10).reverse(),
    y: xValues,
    labels: barLabel.slice(0, 10).reverse(),  // NOT WORKING
    hovertext: barHover,
    mode: 'markers',
    type:"bar",
    orientation: "h",
};

console.log(bar)

// Create data variable and display
  var data = [trace];
  var layout = {title: "Top 10 OTUs"}

  Plotly.newPlot("bar", data, layout)

// Build the PIE plot
var pieValue = result.sample_values.slice(0, 10);
var pieLabel = result.otu_ids.slice(0, 10);
var pieHover = result.otu_labels.slice(0, 10);

var data = [{
  values: pieValue,
  labels: pieLabel,
  hovertext: pieHover,
  type: 'pie'
}];

Plotly.newPlot('pie', data);
  });
}

// Define the function to initialize the data
function init(){
  d3.json("./samples.json").then(function(data){
    var selector = d3.select("#selDataset");
    var sampleNames = data.names;
    sampleNames.forEach((sample)=>{
      selector.append("option").text(sample).property("value", sample);
    })
    buildMetaData(sampleNames[0])
    buildCharts(sampleNames[0])
  });
}

init();
    
// Define the function when a new ID is se
d3.selectAll("#selDataset").on("change", updatePlotly);
function updatePlotly() {

  // Use D3 to select the dropdown menu
  var dropdownMenu = d3.select("#selDataset");

  // Assign the value of the dropdown menu option to a variable
  var dataset = dropdownMenu.property("value");

  buildMetaData(dataset)
  buildCharts(dataset)
};
