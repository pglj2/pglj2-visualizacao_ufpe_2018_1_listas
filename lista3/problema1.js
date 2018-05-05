var dados = [];
var dadosMapa1 = [];
var dadosMapa2 = [];
var dadosMapa3 = [];

var margin = {top:40,left:40,bottom:20,right:20};
var totalWidth = 500;
var totalHeight = 550;
var width = totalWidth - margin.left - margin.right;
var height = totalHeight - margin.top - margin.bottom;

var svgin = d3.select("body")
    .append("svg")
    .attr("width", totalWidth)
    .attr("height", totalHeight);

var svg = svgin
    .append("g")
    .attr("transform","translate("+margin.left+","+margin.top+")");

var defs = svgin.append("defs");
var linearGradient = defs.append("linearGradient")
                         .attr("id", "linear-gradient")
                         .attr("x1", "0%")
                         .attr("y1", "0%")
                         .attr("x2", "100%")
                         .attr("y2", "0%");

linearGradient.append("stop")
              .attr("offset", "0%")
              .attr("stop-color", "#fee0d2");

linearGradient.append("stop")
              .attr("offset", "100%")
              .attr("stop-color", "#de2d26");

var radios = document.getElementsByName("mapa");
var checkRadios = setInterval(function() {
  if(radios.length != 0) {
    setOnClickRadios();
    clearInterval(checkRadios);
  }
}, 100);

function setOnClickRadios() {
  for(var i = 0, len = radios.length; i < len; i++) {
    radios[i].onclick = function() {
      if(this.value == "mapa1") mapa1();
      else if(this.value == "mapa2") mapa2();
      else if(this.value == "mapa3") mapa3();
    }
  }
}

function fillCircleColor(ocorrencia) {
  if(ocorrencia.includes("ACIDENTE")) {
    return "red";
  } else if(ocorrencia.includes("INCIDENTE")) {
    return "blue";
  } else {
      return "green"
  }
}

var projection = d3.geoMercator()
                   .translate([200, 150])
                   .center([-55, -10])
                   .scale([700]);

var path = d3.geoPath()
             .projection(projection);

d3.csv("https://raw.githubusercontent.com/nosbielcs/opendata_aig_brazil/master/data/oco.csv", function(data){
  dados = data;
  console.log("dados-oco:");
  console.log(dados);

  for(var i = 0; i < dados.length; i++) {
    dadosMapa1.push([projection([dados[i].ocorrencia_longitude, dados[i].ocorrencia_latitude]), dados[i].ocorrencia_classificacao]);

    if(isNaN(dadosMapa2[dados[i].ocorrencia_uf])) {
      dadosMapa2[dados[i].ocorrencia_uf] = 1;
    } else {
      dadosMapa2[dados[i].ocorrencia_uf]++;
    }

    var cidade = dados[i].ocorrencia_cidade.toLowerCase();
    if(isNaN(dadosMapa3[cidade])) {
      dadosMapa3[cidade] = 1;
    } else {
      dadosMapa3[cidade]++;
    }
  }
  //Para começar mostrando o mapa 1
  mapa1();
});

function mapa1() {
  svg.selectAll("*").remove();

  d3.json("https://raw.githubusercontent.com/tbrugz/geodata-br/master/geojson/geojs-100-mun.json", function(json) {

    svg.selectAll("path")
       .data(json.features)
       .enter()
       .append("path")
       .attr("class", "mapa")
       .attr("d", path)

    svg.selectAll("circle")
       .data(dadosMapa1)
       .enter()
       .append("circle")
       .attr("cx", d => d[0][0])
       .attr("cy", d => d[0][1])
       .attr("r", "2px")
       .attr("fill", d => fillCircleColor(d[1]));
  });
}

function mapa2() {
  svg.selectAll("*").remove();

  var max = 0;
  for(var i in dadosMapa2){
    if(dadosMapa2[i] > max) {
      max = dadosMapa2[i];
    }
  }

  var colorScale = d3.scaleLinear().domain([0, max]).range(["#fee0d2","#de2d26"]);

  d3.json("https://raw.githubusercontent.com/codeforamerica/click_that_hood/master/public/data/brazil-states.geojson", function(json) {
    svg.selectAll("path")
       .data(json.features)
       .enter()
       .append("path")
       .attr("class", "mapa")
       .attr("d", path)
       .attr("stroke", "white")
       .attr("stroke-width", "0.5px")
       .attr("fill", d => colorScale(dadosMapa2[d.properties.sigla]))

    svg.append("rect")
       .attr("width", 300)
       .attr("height", 10)
       .attr("fill", "url(#linear-gradient)")
       .attr("transform", "translate(" + ((width/2)-150) + "," + (height-margin.top+20+15) + ")");

    svg.append("text")
       .attr("transform", "translate(" + ((width/2)-75) + "," + (height-margin.top+20+13) + ")")
       .attr("fill", "gray")
       .text("Número de Ocorrências");

    svg.append("text")
       .attr("transform", "translate(" + ((width/2)-150) + "," + (height-margin.top+20+23+15) + ")")
       .attr("fill", "gray")
       .text("0");

    svg.append("text")
       .attr("transform", "translate(" + ((width/2)+140) + "," + (height-margin.top+20+23+15) + ")")
       .attr("fill", "gray")
       .text(max);

    svg.append("text")
       .attr("transform", "translate(" + ((width/2)-10) + "," + (height-margin.top+20+23+15) + ")")
       .attr("fill", "gray")
       .text(Math.floor(max/2));
  });

}

function mapa3() {
  svg.selectAll("*").remove();

  var max = 0;
  var len = 0;
  for(var i in dadosMapa3){
    len++;
    if(dadosMapa3[i] > max) {
      max = dadosMapa3[i];
    }
  }

  var count = 0;

  var colorScale = d3.scaleLinear().domain([0, max]).range(["#fee0d2","#de2d26"]);

//"https://raw.githubusercontent.com/tbrugz/geodata-br/master/geojson/geojs-100-mun.json"
  d3.json("https://visualizacao-ufpe.github.io/data_vis_assignments/2017.2/data/geojs-100-mun.json.txt", function(json) {
    console.log("dados-mun:");
    console.log(json);

    svg.selectAll("path")
       .data(json.features)
       .enter()
       .append("path")
       .attr("class", "mapa")
       .attr("d", path)
       .attr("stroke", "white")
       .attr("stroke-width", "0.1px")
       .attr("fill", d => {
         var val;
         if(isNaN(dadosMapa3[d.properties.name.toLowerCase()])) {
           val = 0;
         } else {
           val = dadosMapa3[d.properties.name.toLowerCase()];
           count++;
         }
         return colorScale(val);
       });

    svg.append("rect")
       .attr("width", 300)
       .attr("height", 10)
       .attr("fill", "url(#linear-gradient)")
       .attr("transform", "translate(" + ((width/2)-150) + "," + (height-margin.top+20+15) + ")");

    svg.append("text")
       .attr("transform", "translate(" + ((width/2)-75) + "," + (height-margin.top+20+13) + ")")
       .attr("fill", "gray")
       .text("Número de Ocorrências");

    svg.append("text")
       .attr("transform", "translate(" + ((width/2)-150) + "," + (height-margin.top+20+23+15) + ")")
       .attr("fill", "gray")
       .text("0");

    svg.append("text")
       .attr("transform", "translate(" + ((width/2)+140) + "," + (height-margin.top+20+23+15) + ")")
       .attr("fill", "gray")
       .text(max);

    svg.append("text")
       .attr("transform", "translate(" + ((width/2)-10) + "," + (height-margin.top+20+23+15) + ")")
       .attr("fill", "gray")
       .text(Math.floor(max/2));
  });
}
