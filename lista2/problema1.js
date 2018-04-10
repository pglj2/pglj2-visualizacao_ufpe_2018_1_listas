var temperatureT =[{RecordHigh:34.2, DailyMean:22.1,RecordLow: 11.9,Month:0},
  {RecordHigh: 34.7,DailyMean:22.4,RecordLow:12.4,Month:1},
  {RecordHigh:33.5,DailyMean:21.8,RecordLow:12.0,Month:2},
  {RecordHigh:31.4,DailyMean:19.7,RecordLow:6.8,Month:3},
  {RecordHigh:29.7,DailyMean:17.4,RecordLow:3.7,Month:4},
  {RecordHigh:28.6,DailyMean:16.3,RecordLow:4.2,Month:5},
  {RecordHigh:29.3,DailyMean:15.8,RecordLow:0.8,Month:6},
  {RecordHigh:33.0, DailyMean:17.1,RecordLow:3.4,Month:7},
  {RecordHigh:35.2,DailyMean:17.9,RecordLow:3.5,Month:8},
  {RecordHigh:34.5,DailyMean:19.0,RecordLow:7.0,Month:9},
  {RecordHigh:34.3, DailyMean:20.2,RecordLow:7.0,Month:10},
  {RecordHigh:33.5, DailyMean:21.1,RecordLow:10.3,Month:11}]


var margin = {top:40,left:40,bottom:20,right:20};
var totalWidth = 1000;
var totalHeight = 500;
var width = totalWidth - margin.left - margin.right;
var height = totalHeight - margin.top - margin.bottom;

var svgin = d3.select("body")
    .append("svg")
    .attr("width", totalWidth)
    .attr("height", totalHeight);

var svg = svgin.append("g")
    .attr("transform","translate("+margin.left+","+margin.top+")");

var xScale = d3.scaleTime()
    .domain([new Date(2017, 0, 1, 0), new Date(2017,11,1,0)])
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

var lineGen = d3.line().x(function(d){ return xScale(new Date(2017,d.Month, 1, 0));})
                        .y(function(d){ return yScale(d.DailyMean); });


var lineLow = d3.line().x(function(d){ return xScale(new Date(2017,d.Month, 1, 0));})
                        .y(function(d){ return yScale(d.RecordLow);});
                     
var lineTempLow = yGroup.append("path").attr("d", lineLow(temperatureT)).style("stroke","pink").style("fill","none").style("stroke-width",5);


var lineHigh = d3.line().x(function(d){ return xScale(new Date(2017,d.Month, 1, 0));})
                        .y(function(d){ return yScale(d.RecordHigh);});
                     
var lineTempHigh = yGroup.append("path").attr("d", lineHigh(temperatureT)).style("stroke","pink").style("fill","none").style("stroke-width",5);

var area = d3.area()      
  .x(function(d){ return xScale(new Date(2017,d.Month, 1, 0));})
  .y0(function(d) { return yScale(d.RecordLow);})
  .y1(function(d) { return yScale(d.RecordHigh);});

var areaBetweenCurves = yGroup.append("path").attr("d", area(temperatureT)).style("fill","pink");


var lineTempAvg = yGroup.append("path").attr("d", lineGen(temperatureT)).style("stroke","black").style("fill","none").style("stroke-width",5);
