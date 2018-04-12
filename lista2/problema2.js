var margin = {top:40,left:40,bottom:20,right:20};
var totalWidth = 400;
var totalHeight = 400;
var width = totalWidth - margin.left - margin.right;
var height = totalHeight - margin.top - margin.bottom;

var x = d3.scaleBand()
      .range([0, width])
var y = d3.scaleLinear()
      .range([height, 0]);

var svg = d3.select("body").append("svg")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
.append("g")
.attr("transform", 
      "translate(" + margin.left + "," + margin.top + ")");


function pegarX(s){
    var x =0 ;
    for(var i = 0; i< trips.length; i++){
        if(trips[i].carrier == s)
        x += 1;
    }

    return x;
}

var tam = pegarX("Tam");
var gol = pegarX("Gol");
var azul = pegarX("Azul");

var tripo = [{carrier:"Tam", valor:tam},
{carrier:"Gol", valor:gol},
{carrier:"Azul", valor:azul}];

tripo.forEach(function(d) {
    d.valor = +d.valor;
  });

  x.domain(tripo.map(function(d) { return d.carrier; }));
  y.domain([0, d3.max(tripo, function(d) { return d.valor; })]);

  svg.selectAll(".bar")
      .data(tripo)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.carrier); })
      .attr("width", x.bandwidth())
      .attr("y", function(d) { return y(d.valor); })
      .attr("height", function(d) { return height - y(d.valor);})
      .attr("fill","steelblue");

d3.selectAll("rect").attr("stroke","black").attr("stroke-width",3);

  svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  svg.append("g")
      .call(d3.axisLeft(y));


//Scatter

// var margin2 = {top:40,left:80,bottom:80,right:20};
// var totalWidth2 = 800;
// var totalHeight2 = 400;
// var width2 = totalWidth2 - margin2.left - margin2.right;
// var height2 = totalHeight2 - margin2.top - margin2.bottom;


function transformAllDateStart(){
    var t = [new Date(parseInt(trips[0].start.substring(6,10)), parseInt(trips[0].start.substring(3,5) - 1),
            parseInt(trips[0].start.substring(0,2)))];
    for(var i = 1; i < trips.length; i++){
        t.push(new Date(parseInt(trips[i].start.substring(6,10)), parseInt(trips[i].start.substring(3,5) - 1),
        parseInt(trips[i].start.substring(0,2))))
    }
    return t;
}
var ks = transformAllDateStart();

function transformAllDatePost(){
    var t = [new Date(parseInt(trips[0].post.substring(6,10)), parseInt(trips[0].post.substring(3,5) - 1),
        parseInt(trips[0].post.substring(0,2)))];
    for(var i = 1; i < trips.length; i++){
        t.push(new Date(parseInt(trips[i].post.substring(6,10)), parseInt(trips[i].post.substring(3,5) - 1),
        parseInt(trips[i].post.substring(0,2))))
}
return t; 
}

var kp = transformAllDatePost();

function getDays(k, j){
    var ret = [Math.ceil(Math.abs(k[0].getTime() - j[0].getTime()) / (1000 * 3600 * 24)  )]

    for(var i = 1; i < trips.length ; i++){
        ret.push(Math.ceil(Math.abs(k[i].getTime() - j[i].getTime()) / (1000 * 3600 * 24)  ))
    }
    return ret;
}

var days = getDays(ks, kp);

function getPrice(){
    var ret = [trips[0].price];
    for(var i = 1 ; i < trips.length; i ++){
        ret.push(trips[i].price);
    }
    return ret;
}

var price = getPrice();

var scat;
function scaterGen(){
    this.scat = [[days[0] , price[0]]];
    for(var i = 1; i < days.length; i++){
        scat.push([days[i], price[i]]);
    }

    //return scat;
}

scaterGen();
var container = d3.select("body").select("svg");
var widgetID = "scat1";
var screenX = 20;
var screenY = 20;
var totalWidth2 = 600;
var totalHeight2 = 500;

var scatterplot = new Scatterplot(container,widgetID,screenX,screenY,totalWidth2,totalHeight2);
scatterplot.setData(scat);


// var svg2 = d3.select("body").append("svg")
//       .attr("width", width2 + margin2.left + margin2.right)
//       .attr("height", height2 + margin2.top + margin2.bottom)
//       .append("g")
//       .attr("transform", 
//             "translate(" + margin2.left + "," + margin2.top + ")");

// var xAxisGroup = svg2.append("g")
//                     .attr("class", "x axis")
//                     .attr("transform", "translate(0,"+height2+")");

// var yAxisGroup = svg2.append("g")
//                     .attr("class", "y axis");

// var xScale = d3.scaleLinear()
//             .range([0,width2]);

// var yScale = d3.scaleLinear()
//         .range([height2,0]);

// svg2.append("text")
//     .attr("y", height2 + 50)
//     .attr("x", width2 / 2)
//     .attr("font-size", "20px")
//     .attr("text-anchor", "middle")
//     .text("Days");

// var yLabel = svg2.append("text")
//             .attr("y", -60)
//             .attr("x", -(height2 / 2))
//             .attr("font-size", "20px")
//             .attr("text-anchor", "middle")
//             .attr("transform", "rotate(-90)")
//             .text("Price");


// xScale.domain([0, d3.max(days)])
// yScale.domain([0, d3.max(price)]).range([height2,0]);

// var xAxisCall = d3.axisBottom(xScale);
// xAxisGroup.call(xAxisCall);

// var yAxisCall = d3.axisLeft(yScale);
// yAxisGroup.call(yAxisCall);

// var circles = svg2.selectAll("circle")
//                           .data(scat)
//                           .enter()
//                           .append("g");

// circles.append("circle")
//                        .attr("cx", function (d) { return d.price; })
//                        .attr("cy", function (d) {  
//                         return d.days; })
                       
//                       .attr("r", 3)
//                       .attr("fill", "green")
                      

