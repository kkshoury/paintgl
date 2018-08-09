class LineRenderer {

	constructor(gl){
		this.temp = [];
		this.points = [];
		this.lineColor = [0.0, 0.0, 0.0, 1.0];
		

	}

	setLineColor(r,g,b,a){
		this.lineColor[0] = r;
		this.lineColor[1] = g;
		this.lineColor[2] = b;
		this.lineColor[3] = a;
	}
	
	addLine(x1, y1, x2, y2){
		if(arguments.length < 4){
			return false;
		}

		for(var i = 0 ; i < arguments.length; i++){
			this.points.push(arguments[i]);
		}
	}

	addTempLine(points){
		this.temp.push(points[0]);
		this.temp.push(points[1]);
		this.temp.push(points[2]);
		this.temp.push(points[3]);
	}

	removeTempLine(){
		this.temp = [];
	}

	render(gl){
		let program  = Shaders.createProgram(gl);
		gl.useProgram(program);
		let aPosition = gl.getAttribLocation(program, "a_position");
		let uColor = gl.getUniformLocation(program, "u_color");
		gl.enableVertexAttribArray(aPosition);
		gl.uniform4fv(uColor, new Float32Array(this.lineColor));
		
		let buffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
		
		let data = this.points;
		if(this.temp.length > 0){
			data = data.concat(this.temp);
		}

		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.DYNAMIC_DRAW);
		gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

		gl.drawArrays(gl.LINES, 0, (data.length) / 2);
	}

}