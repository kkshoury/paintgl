class LineRenderer {

	constructor(gl){
		this.temp = [];
		this.points = [];
		this.lineColor = [0.0, 0.0, 0.0, 1.0];
		this.programCreated = false;
		this.aPosition; 
		this.uColor;
		this.bufferUnit = new BufferUnit();
		

	}

	initBuffers(gl){
		if(!this.bufferUnit.getVertexBuffer()){
			let buffer = gl.createBuffer();
			this.bufferUnit.setVertexBuffer(buffer);
		}

		let vbuffer = this.bufferUnit.getVertexBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, vbuffer);
		
		let data = this.points;
		if(this.temp.length > 0){
			data = data.concat(this.temp);
		}

		this.bufferUnit.setVertexData(new Float32Array(data));
		gl.bufferData(gl.ARRAY_BUFFER, this.bufferUnit.getVertexData(), gl.DYNAMIC_DRAW);
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

		this.bufferUnit.setDirty(true);
	}

	addTempLine(points){
		this.temp.push(points[0]);
		this.temp.push(points[1]);
		this.temp.push(points[2]);
		this.temp.push(points[3]);
		this.bufferUnit.setDirty(true);
	}

	removeTempLine(){
		this.temp = [];
		this.bufferUnit.setDirty(true);

	}

	render(gl){
		if(!this.programCreated){
			this.program  = Shaders.createProgram(gl);
			this.aPosition = gl.getAttribLocation(this.program, "a_position");
 			this.uColor = gl.getUniformLocation(this.program, "u_color");
		}

		if(this.bufferUnit.isDirty()){
			this.initBuffers(gl);
			this.bufferUnit.setDirty(false);
		}

		gl.useProgram(this.program);
		gl.enableVertexAttribArray(this.aPosition);
		gl.uniform4fv(this.uColor, new Float32Array(this.lineColor));
		
		gl.bindBuffer(gl.ARRAY_BUFFER, this.bufferUnit.getVertexBuffer());
		gl.vertexAttribPointer(this.aPosition, 2, gl.FLOAT, false, 0, 0);

		gl.drawArrays(gl.LINES, 0, (this.bufferUnit.getVertexData().length) / 2);
	}

}