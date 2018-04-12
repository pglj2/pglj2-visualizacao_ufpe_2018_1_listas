class Scatterplot{
    constructor(container,widgetID,screenX,screenY,totalWidth,totalHeight) {
	//
	this.renderingArea = {x:screenX,y:screenY,
			      width:totalWidth,height:totalHeight};
	this.margins = {left:55,right:25,top:25,bottom:25};
	this.canvasWidth = this.renderingArea.width - this.margins.left - this.margins.right;
	this.canvasHeight = this.renderingArea.height - this.margins.top - this.margins.bottom;
	this.widgetID = widgetID;

	//
	this.data = [];	
	
	//
	this.canvas = container
	    .append("g")
	    .attr("id","plot_" + widgetID)
	    .attr("transform","translate("+
		  (this.renderingArea.x+this.margins.left) + ", " + (this.renderingArea.y+this.margins.top) + ")");
	
		  this.canvas.append("text")
		  .attr("y", this.canvasHeight + 50)
		  .attr("x", this.canvasWidth / 2)
		  .attr("font-size", "20px")
		  .attr("text-anchor", "middle")
		  .text("Days");
	  
		  this.canvas.append("text")
            .attr("y", -60)
            .attr("x", -(this.canvasHeight / 2))
            .attr("font-size", "20px")
            .attr("text-anchor", "middle")
            .attr("transform", "rotate(-90)")
            .text("Price");
	//
	this.xScale = d3.scaleLinear()
	    .range([0,this.canvasWidth]);
	this.xAxis  = d3.axisBottom(this.xScale);
	this.canvas
	    .append("g")
	    .attr("class","xAxis")
	    .attr("transform","translate(0," + this.canvasHeight  + ")");

	//
	this.yScale = d3.scaleLinear()
	    .range([this.canvasHeight,0]);
	this.yAxis  = d3.axisLeft(this.yScale);
	this.canvas
	    .append("g")
	    .attr("class","yAxis");

		//
	var plot = this;
	var brushGroup = this.canvas.append("g").attr("class","brush");
	this.brush = d3.brush()
	    .on("start",function(){
		plot.canvas.selectAll("circle").attr("fill","green");
	    })
	    .on("brush",function(){
		var selectedPoints = [];
		var selection = d3.event.selection;
		plot.canvas.selectAll("circle")
		    .attr("fill",function(d,i){
			var x = plot.xScale(d[0]);
			var y = plot.yScale(d[1]);
			if(selection[0][0]<=x && x<=selection[1][0] &&
			   selection[0][1] <= y && y <= selection[1][1]){
			    selectedPoints.push(i);
			    return "orange";
			}
			else
			    return "green";
		    });
		//
		if(plot.selectionCallback)
		    plot.selectionCallback(selectedPoints);
	    });
	brushGroup.call(this.brush);

	
	//	
	this.updatePlot();
    }
    
    setSelectionCallback(f){
	this.selectionCallback = f;
    }

    
    setData(newData) {
	this.data = newData;
	//
	this.xScale.domain(d3.extent(newData,d=>d[0]));
	this.yScale.domain(d3.extent(newData,d=>d[1]));
	//
	this.updatePlot();
    }

	removeData(){
		this.updateAxis();
		var circles = this.canvas.selectAll("circle");
		circles.remove();
	}

    updateAxis() {
	var canvasWidth = this.canvasWidth;
	var canvasHeight = this.canvasHeight;

	//text label for the x axis
	this.xAxis(this.canvas.select(".xAxis"));

	//text label for the y axis
	this.yAxis(this.canvas.select(".yAxis"));
    }
    
    updateDots() {
	var circles = this.canvas.selectAll("circle").data(this.data);
	circles.exit().remove();
	var plot = this;
	circles
	    .enter()
	    .append("circle")
	    .merge(circles)
	    .attr("cx",d=>plot.xScale(d[0]))
	    .attr("cy",d=>plot.yScale(d[1]))
	    .attr("r",3)
	    .attr("fill","green")
	    .attr("fill-opacity",0.5);
    }
    
    updatePlot(){
	this.updateAxis();
	this.updateDots();
     }       
}