function buildMetadata(sample) {
  // Using `d3.json` to fetch the metadata for a sample
  // console.log(sample)
  var url = `/metadata/${sample}`;
  d3.json(url).then(function(sample){
    console.log(sampleData);
    
    // Using d3 to select the panel with id of `#sample-metadata`
    var panel = d3.select("#sample-metadata");
    
    // Using `.html("") to clear any existing metadata
    panel.html("");
    
    // Using `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.


    Object.entries(sample).forEach(function ([key, value]) {
      var row = sample_metadata.append("p");
      row.text(`${key}: ${value}`);
    });
      }
    )};
  
  
  function buildCharts(sample) {
    
    // @TODO: Use `d3.json` to fetch the sample data for the plots
    var url = `/samples/${sample}`;
    d3.json(url).then(function(data) {
    // @TODO: Build a Bubble Chart using the sample data
    var bubbleData = [{
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      marker: {
        size: sample_values,
        color: otu_ids,
        colorscale: 'Earth'
      }
    }];      

    var bubbleLayout = {
      margin: { t: 0 },
      hovermode: 'closest',
      xaxis: {title: 'OTU ID'},
    };

    Plotly.plot('bubble', bubbleData, bubbleLayout);

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
    var pieData = [{
      values: sample_values.slice(0,10),
      labels: otu_ids.slice(0,10),
      hovertext: otu_labels.slice(0,10,),
      hoverinfo: 'hovertext',
      type: 'pie'
    }];

    var pieLayout = {
      margin: {t: 0, l: 0}
    }

    Plotly.plot('pie', pieData, pieLayout); 

  });
}

  
  // const defaultURL = "/metadata/<sample>";
  // d3.json(defaultURL).then(function (data) {
  //   var data = [data];
  //   var layout = { margin: { t: 30, b: 100 } };
  //   Plotly.plot("bar", data, layout);
  // });
  


function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();