var dados = [];
var tsneInput = [];
var result;

var margin = {top:40,left:40,bottom:20,right:20};
var totalWidth = 500;
var totalHeight = 550;
var width = totalWidth - margin.left - margin.right;
var height = totalHeight - margin.top - margin.bottom - 50;

var svgin = d3.select("body")
    .append("svg")
    .attr("width", totalWidth)
    .attr("height", totalHeight);

var svg = svgin
    .append("g")
    .attr("transform","translate("+margin.left+","+margin.top+")");

var label = svg.append("text")
               .attr("transform", "translate(" + ((width/2)-75) + "," + (height+40) + ")")
               .text("Região Metropolitana");

var xScale = d3.scaleLinear().range([0,width]);
var yScale = d3.scaleLinear().range([0,height]);
console.log("data vai?");
d3.csv("https://raw.githubusercontent.com/pglj2/pglj2-visualizacao_ufpe_2018_1_listas/master/lista3/dados/aids_data.csv?token=ALTw1y5fVVcIwnGzIHHpB4fBuzNTCXXSks5a9m2MwA%3D%3D", function(data){
  dados = data;
  console.log("data foi");
  console.log(dados);

  for(var i = 0; i < dados.length; i++) {
    var arrAux = [];

    for(var j = 0; j < dados.length; j++) {
        var aux = 0;
        for(var k in dados[i]) {
          if (k != "Regiao") {
            aux += Math.pow((dados[i][k] - dados[j][k]), 2);
          }
        }
        arrAux.push(Math.sqrt(aux));
    }

    tsneInput.push(arrAux);
  }
  console.log("tsne inp: ");
  console.log(tsneInput);

  var opt = {};
  opt.epsilon = 10;
  opt.perplexity = 30;
  opt.dim = 2;

  var tsne = new tsnejs.tSNE(opt);
  tsne.initDataDist(tsneInput);
  for(var k = 0; k < 500; k++) {
    tsne.step();
  }
  result = tsne.getSolution();
  console.log("res");
  console.log(result);

  var minX = Math.min.apply(Math, result.map(d=>d[0]));
  var maxX = Math.max.apply(Math, result.map(d=>d[0]));
  console.log(minX, maxX);
  xScale.domain([minX, maxX]);

  var minY = Math.min.apply(Math, result.map(d=>d[1]));
  var maxY = Math.max.apply(Math, result.map(d=>d[1]));
  console.log(minY, maxY);
  yScale.domain([minY, maxY]);

  var xAxis = d3.axisBottom(xScale);
  svg.append("g")
     .attr("class","xAxis")
     .attr("transform", "translate(0," + height + ")")
     .call(xAxis);

  var yAxis = d3.axisLeft(yScale);
  svg.append("g")
     .attr("class","yAxis")
     .call(yAxis);

  console.log(result[0][0], result[0][1]);
  console.log(xScale(result[0][0]), yScale(result[0][1]));

  svg.selectAll("circle")
     .data(result)
     .enter()
     .append("circle")
     .attr("cx", d => xScale(d[0]))
     .attr("cy", d => yScale(d[1]))
     .attr("r", "5px")
     .attr("fill", "black")
     .on("mouseover", function(d, i){ label.text(dados[i]["Regiao"]); label.attr("fill", "red") });
});
