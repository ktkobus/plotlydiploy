function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;
    
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
   
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// Deliverable 1: 1. Create the buildChart function.
function buildCharts(sample) {
  // Deliverable 1: 2. Use d3.json to load the samples.json file 
  d3.json("samples.json").then((data) => {
    // console.log(data);

    // Deliverable 1: 3. Create a variable that holds the samples array. 
    var selectedSample = data.samples;

    // Deliverable 1: 4. Create a variable that filters the samples for the object with the desired sample number.
    // Deliverable 1: 5. Create a variable that holds the first sample in the array.
    var resultArray = selectedSample.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    console.log("this is my result")
    console.log(result);
    
    
    // Deliverable 3: 1. Create a variable that filters the metadata array for the object with the desired sample number.
    // Deliverable 3: 2. Create a variable that holds the first sample in the metadata array.
    
    let selectedMeta = data.metadata;
    let metaArray = selectedMeta.filter(metaObj => metaObj.id == sample)
    let meta = metaArray[0];
    console.log("This is my metadata")
    console.log(meta)   
    
    // Deliverable 1: 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var sample_result = []
    
    var sample_values = result.sample_values;
    console.log(sample_values)
    
    for (var i = 0; i < sample_values.length; i ++) {
      sample_result.push({
        otu_ids: result.otu_ids[i],
        otu_labels: result.otu_labels[i],
        sample_values: result.sample_values[i]
      });
    }

    // Deliverable 3: 3. Create a variable that holds the washing frequency.
    let washFreq = meta.wfreq
    console.log("This is my wash freq")
    console.log(washFreq)

    // Deliverable 1: 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order 
    // so the otu_ids with the most bacteria are last. 
    
    var yticks = sample_result.sort((a,b) => 
    b.sample_values - a.sample_values).slice(0,10).reverse().map(id => "OTU " + id.otu_ids.toString());
    
    var x = sample_result.sort((a,b) => 
    b.sample_values - a.sample_values).slice(0,10).reverse().map(value => value.sample_values)

    // Deliverable 1: 8. Create the trace for the bar chart. 
    var barData = [{
      x: x,
      y: yticks,
      type: "bar",
      orientation: "h",
  }];

    // Deliverable 1: 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found",
    };

    // Deliverable 1: 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);

    // Deliverable 2: 1. Create the trace for the bubble chart.
    var sampleOtuIDs = sample_result.map(id => id.otu_ids);

    console.log("this is the sample OTU Id for bubble chart")
    console.log(sampleOtuIDs)
 
    var sampleOtuLabel = sample_result.map(label => label.otu_labels);
    
    var sampleValues = sample_result.map(value => value.sample_values);
    
    console.log("This is my sampleValues");
    console.log(sampleValues);
    
    var xdata = sampleOtuIDs
    var ydata = sampleValues

    function bubbleChart(xdata,ydata) {
    var trace1 = {
      x: xdata,
      y: ydata,
      text: sampleOtuLabel,
      mode: 'markers',
      marker: {
        color: sampleOtuIDs,
        colorscale: 'Earth',
        opacity: 0.7,
        size: sampleValues
    }
    };

    var data = [trace1];

    // Deliverable 2: 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: 'Bacteria Cultures Per Sample',
      showlegend: false,
      height: 500,
      width: 1200
    };

    // Deliverable 2: 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot('bubble', data, bubbleLayout);}
    bubbleChart(xdata,ydata)
    
    // Deliverable 3: 4. Create the trace for the gauge chart.
    function gauge(){
      var gaugeData = [
        {
          domain: { x: [0, 1], y: [0, 1] },
          value: washFreq,
          title: { text: "Belly Button Washing Frequency<br><sub>Scrubs per Week</sub>"},
          type: "indicator",
          mode: "gauge+number",
          gauge: {
            axis: {
              range: [0, 10],
              tickmode: 'linear',
              tick0: 2,
              dtick: 2,
              ticks: 'outside'  
            },
            bar: {
              color: "black"
            },
            steps: [
              {range: [0,2], color: 'red'},
              {range: [2,4], color: 'darkorange'},
              {range: [4,6], color: 'yellow'},
              {range: [6,8], color: 'yellowgreen'},
              {range: [8,10], color: 'green'},
            ] 
          }
         }
      ];

    // Deliverable 3: 5. Create the layout for the gauge chart.
    var guageLayout = {width: 600,
      height: 500,
      margin: { t: 0, b: 0 },
    };

    // Deliverable 3: 6. Use Plotly to plot the gauge data and layout.
      Plotly.newPlot('gauge', gaugeData, guageLayout);}
      gauge();
  });
};
