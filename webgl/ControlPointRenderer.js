class ControlPointRenderer {

	constructor(gl){
		this.points = [];
		
		

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
		let buffer = gl.createBuffer();
		let program  = Shaders.createControlPointProgram(gl);
		let __aPosition = gl.getAttribLocation(program, "a_position");
		gl.useProgram(program);

		gl.enableVertexAttribArray(__aPosition);
		gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.points), gl.DYNAMIC_DRAW);
		
		gl.vertexAttribPointer(__aPosition, 2, gl.FLOAT, false, 0, 0);
		
		// gl.pointSize(6.0);
		gl.drawArrays(gl.POINTS, 0, this.points.length / 2);
		// gl.pointSize(5.0);
		// gl.drawArrays(gl.POINTS, 0, this.points.length / 2);

	}

}