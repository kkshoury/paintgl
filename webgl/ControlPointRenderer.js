class ControlPointRenderer {

	constructor(gl){
		this.points = [];
		this.bufferUnit = new BufferUnit();
		this.programCreated = false;
		this.aPosition; 
		this.bufferUnit = new BufferUnit();
		// this.on = false;
		

	}

	initBuffers(gl){
		if(!this.bufferUnit.getVertexBuffer()){
			let buffer = gl.createBuffer();
			this.bufferUnit.setVertexBuffer(buffer);
		}

		let vbuffer = this.bufferUnit.getVertexBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, vbuffer);
		
		this.bufferUnit.setVertexData(new Float32Array(this.points));
		gl.bufferData(gl.ARRAY_BUFFER, this.bufferUnit.getVertexData(), gl.DYNAMIC_DRAW);
	}

	addControlPoints(points){
		points.forEach((p) => this.points.push(p));
		this.bufferUnit.setDirty(true);

	}

	addControlPoint(p){
		this.points.push(p[0]);
		this.points.push(p[1]);
		this.bufferUnit.setDirty(true);

	}

	clearControlPoints(){
		this.points = [];
		this.bufferUnit.setDirty(true);

	}

	render(gl){
		if(this.points.length == 0){
			return;
		}
		
		if(!this.programCreated){
			this.program  = Shaders.createControlPointProgram(gl);
			this.aPosition = gl.getAttribLocation(this.program, "a_position");
 			this.uColor = gl.getUniformLocation(this.program, "u_color");
		}

		if(this.bufferUnit.isDirty()){
			this.initBuffers(gl);
			this.bufferUnit.setDirty(false);
		}

        gl.useProgram(this.program);

		gl.enableVertexAttribArray(this.aPosition);
		gl.bindBuffer(gl.ARRAY_BUFFER, this.bufferUnit.getVertexBuffer());
		gl.vertexAttribPointer(this.aPosition, 2, gl.FLOAT, false, 0, 0);
		
		gl.drawArrays(gl.POINTS, 0, this.bufferUnit.getVertexData().length / 2);

	}

}