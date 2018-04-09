var yearArray = ["Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

var temperature ={
    "RecordHigh":[34.2, 34.7, 33.5, 31.4, 29.7, 28.6, 29.3, 33.0, 35.2, 34.5, 35.3, 33.5],
    "DailyMean": [22.1, 22.4, 21.8, 19.7, 17.4, 16.3, 15.8, 17.1, 17.9, 19.0, 20.2, 21.1],
    "RecordLow": [11.9, 12.4, 12.0, 6.8, 3.7, 4.2, 0.8, 3.4, 3.5, 7.0, 7.0, 10.3],
    "Month": yearArray
    }

var margin = {top:40,left:40,bottom:20,right:20};
var totalWidth = 700;
var totalHeight = 400;
var width = totalWidth - margin.left - margin.right;
var height = totalHeight - margin.top - margin.bottom;

var svgin = d3.select("body")
    .append("svg")
    .attr("width", totalWidth)
    .attr("height", totalHeight);

var svg = svgin
    .append("g")
    .attr("transform","translate("+margin.left+","+margin.top+")");

var xScale = d3.scaleTime()
    .domain([new Date("2017-01-01"), new Date("2018-01-01")])
    .range([0, width]);

var yScale = d3.scaleLinear()
    .domain([0,d3.max(temperature.RecordHigh)])
    .range([height,0]);

    var xAxis = d3.axisBottom(xScale)
    .tickFormat(function(date){
      if (d3.timeYear(date) < date) {
        return d3.timeFormat('%b')(date);
      } else {
        return d3.timeFormat('%Y')(date);
      }
    });
    
  var xAxisg = svg.append("g")
    .attr("class", "x axis")
    .attr("transform","translate(0,"+(height-margin.bottom)+")");
      
  var xAxis = d3.axisTop(xScale);
  xAxis(xAxisg);
  
  xAxisg.selectAll(".tick text")
            .attr("y", 15);

var yGroup = svg.append("g");
var yAxisGroup = yGroup.attr("transform","translate(0,"+-margin.bottom+")");
var yAxis = d3.axisRight(yScale);
yAxis(yAxisGroup);

yAxisGroup.selectAll(".tick text")
          .attr("x", -15);

var lineGen = d3.line().x(temperature.timeYear)
                        .y(function(d){ return yScale(d.DailyMean); });