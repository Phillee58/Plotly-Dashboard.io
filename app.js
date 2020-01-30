function buildMetaData(sample){
// Function that builds the metadata panel usind d3
d3.json("./samples.json").then(function(data){
  // Use d3 to select the panel with id of `#sample-metadata`
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
function buildCharts(sample) {
  
  // Fetch the sample data for the plots
  d3.json("./samples.json").then(function(data){
    var samples = data.samples;
    var result = samples.filter(sampleobj => sampleobj.id==sample)[0]

  // Build a Bubble Chart using the sample data
      var xValues = result.otu_ids;
      var yValues = result.sample_values;
      var mSize = result.sample_values;
      var mClrs = result.otu_ids;
      var tValues = result.otu_labels;
      
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

      var pieValue = result.sample_values.slice(0, 10);
        var pielabel = result.otu_ids.slice(0, 10);
        var pieHover = result.otu_labels.slice(0, 10);
  
        var data = [{
          values: pieValue,
          labels: pielabel,
          hovertext: pieHover,
          type: 'pie'
        }];
  
        Plotly.newPlot('pie', data);
    });
};


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
    
 
// Call updatePlotly() when a change takes place to the DOM
d3.selectAll("#selDataset").on("change", updatePlotly);

// This function is called when a dropdown menu item is selected
function updatePlotly() {

  // Use D3 to select the dropdown menu
  var dropdownMenu = d3.select("#selDataset");

  // Assign the value of the dropdown menu option to a variable
  var dataset = dropdownMenu.property("value");

  buildMetaData(dataset)
  buildCharts(dataset)
};

