/*
	Renders from textures
*/

class RasterLayerRenderer{
	constructor(){
		this.points = [];
		this.texCoords = [];


		this.program;
		this.bufferUnit = new BufferUnit();
		this.programInitialized = false;
		this.buffersReady = false;
		this.aPosition;
		this.aTexCoords;
		this.uTexture;
	}

	initBuffers(gl){

		if(this.texCoords.length == 0){
			this.texCoords = [        
				0, 1,
				0, 0,
				1, 1,
				1, 1,
				0, 0,
				1, 0
		    ];
		}


		if(this.points.length == 0){
			this.points = [
				-1, 1,
				-1, -1,
				1, 1,
				1, 1,
				-1, -1,
				1, -1 

			 ];
		}

		let vBuffer;
		if(!this.bufferUnit.getVertexBuffer()){
		 	vBuffer = gl.createBuffer();
		 	this.bufferUnit.setVertexBuffer(vBuffer);
		} 

		vBuffer = this.bufferUnit.getVertexBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
		this.bufferUnit.setVertexData(new Float32Array(this.points));
		gl.bufferData(gl.ARRAY_BUFFER, this.bufferUnit.getVertexData(), gl.STATIC_DRAW);

		let tBuffer;
		if(!this.bufferUnit.getTexCoordBuffer()){
		 	tBuffer = gl.createBuffer();
		 	this.bufferUnit.setTexCoordBuffer(tBuffer);
		} 
		
		tBuffer = this.bufferUnit.getTexCoordBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, tBuffer);
		this.bufferUnit.setTexCoordData(new Float32Array(this.texCoords));
		gl.bufferData(gl.ARRAY_BUFFER, this.bufferUnit.getTexCoordData(), gl.STATIC_DRAW);

		gl.bindBuffer(gl.ARRAY_BUFFER, null);
	}



	render(gl, texture){
		if(!gl || !texture){
			return;
		}

		if(!this.programInitialized){
			this.program = Shaders.createSimpleTextureProgram(gl);
			if(this.program){
				this.programInitialized = true;
				this.aPosition = gl.getAttribLocation(this.program, "a_position");
				this.aTexCoords = gl.getAttribLocation(this.program, "a_texCoord");
				this.uTexture = gl.getUniformLocation(this.program, "u_texture");
				this.programInitialized = true;
			}
		}

		if(!this.buffersReady){
			this.initBuffers(gl);
			this.buffersReady = true;
		}

		gl.useProgram(this.program);

		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, texture);
		gl.uniform1i(this.uTexture, 0);

		

		gl.bindBuffer(gl.ARRAY_BUFFER, this.bufferUnit.getVertexBuffer());
		gl.enableVertexAttribArray(this.aPosition);
		gl.vertexAttribPointer(this.aPosition, 2, gl.FLOAT, false, 0, 0);

		gl.enableVertexAttribArray(this.aTexCoords);
		gl.bindBuffer(gl.ARRAY_BUFFER, this.bufferUnit.getTexCoordBuffer());
		gl.vertexAttribPointer(this.aTexCoords, 2, gl.FLOAT, false, 0, 0);

		// gl.bindBuffer(gl.ARRAY_BUFFER, this.bufferUnit.getVertexBuffer());
		// gl.viewport(0, 0, 800, 600);
		gl.drawArrays(gl.TRIANGLES, 0, this.bufferUnit.getVertexData().length/2);

		gl.bindBuffer(gl.ARRAY_BUFFER, null);
		gl.bindTexture(gl.TEXTURE_2D, null);
		gl.useProgram(null);


	}
}