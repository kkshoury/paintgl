class ControlPointRenderer {

	constructor(gl){
		this.points = [];
		this.buffer = gl.createBuffer();
		this.program  = Shaders.createControlPointProgram(gl);
		this.__aPosition = gl.getAttribLocation(this.program, "a_position");
		

	}

	addControlPoints(points){
		points.forEach((p) => this.points.push(p));
	}

	addControlPoint(p){
		this.points.push(p[0]);
		this.points.push(p[1]);
	}

	clearControlPoints(){
		this.points = [];
	}

	render(gl){
		gl.useProgram(this.program);

		gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
		
		gl.enableVertexAttribArray(this.__aPosition);
		gl.vertexAttribPointer(this.__aPosition, 2, gl.FLOAT, false, 0, 0);
		
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.points), gl.DYNAMIC_DRAW);
		// gl.pointSize(6.0);
		gl.drawArrays(gl.POINTS, 0, this.points.length / 2);
		// gl.pointSize(5.0);
		// gl.drawArrays(gl.POINTS, 0, this.points.length / 2);

	}

}