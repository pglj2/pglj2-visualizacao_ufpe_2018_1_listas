
var margin = {top: 20, right: 20, bottom: 30, left: 40};
var width = 400 - margin.left - margin.right;
var height = 400 - margin.top - margin.bottom;

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

function scaterGen(){
    var scater = [{"days":days[0] , "price":price[0]}];
    for(var i = 1; i < days.length; i++){
        scater.push({"days":days[i], "price":price[i]});
    }

    return scater;
}

var scat = scaterGen();

var svg2 = d3.select("body").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", 
            "translate(" + margin.left + "," + margin.top + ")");
      

margin = {left: 80, right:20, top:50, bottom: 100};
width = 400 - margin.left - margin.right;
heigth = 400 - margin.top - margin.bottom;

var t = d3.transition().duration(750);

var xAxisGroup = svg2.append("g")
                    .attr("class", "x axis")
                    .attr("transform", "translate(0,"+height+")");

var yAxisGroup = svg2.append("g")
                    .attr("class", "y axis");

var x2 = d3.scaleLinear()
            .range([0,width]);

var y2 = d3.scaleLinear()
        .range([height,0]);

svg2.append("text")
    .attr("y", height + 50)
    .attr("x", width / 2)
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")
    .text("Month");

var yLabel = svg2.append("text")
            .attr("y", -60)
            .attr("x", -(height / 2))
            .attr("font-size", "20px")
            .attr("text-anchor", "middle")
            .attr("transform", "rotate(-90)")
            .text("Revenue");


x2.domain([0, d3.max(days)]);
y2.domain([0, d3.max(price)]);

var xAxisCall = d3.axisBottom(x2);
xAxisGroup.transition(t).call(xAxisCall);

var yAxisCall = d3.axisLeft(y2);
yAxisGroup.transition(t).call(yAxisCall);

var circles = svg2.selectAll("circle")
                .data(days)

circles.enter().append("circle")
                .attr("fill", "grey")
                .attr("cy", y(0))
                .attr("cx", function(d){ return x(d.days) + x.bandwidth() / 2})
                .attr("r", 5)



