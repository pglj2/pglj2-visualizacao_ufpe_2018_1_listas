
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


function pegarTam(){
    var x =0 ;
    for(var i = 0; i< trips.length; i++){
        if(trips[i].carrier == "Tam")
        x += 1;
    }

    return x;
}

function pegarAzul(){
    var x =0 ;
    for(var i = 0; i< trips.length; i++){
        if(trips[i].carrier == "Azul")
        x += 1;
    }

    return x;
}

function pegarGol(){
    var x =0 ;
    for(var i = 0; i< trips.length; i++){
        if(trips[i].carrier == "Gol")
        x += 1;
    }

    return x;
}

var tam = pegarTam();
var gol = pegarGol();
var azul = pegarAzul();

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

