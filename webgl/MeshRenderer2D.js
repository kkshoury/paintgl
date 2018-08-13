class MeshRenderer2D {
	contructor(on){
		let buffersReady = false;
		let bufferUnit = new BufferUnit();
		
		let programCreated = false;
		let program;
		let aPosition; 
		let aColor;
		
		this.on = on;


		function initProgram(gl){
			program = Shaders.createPolygon2DProgram();

			if(!program){
				log("Failed to init program in MeshRenderer2D");
				return false;
			}

			aPosition = gl.getAttribLocation(gl, "a_position");
			aColor = gl.getAttribLocation(gl, "a_color");
			return true;
		}


		function initBuffers(gl){
			let vBuffer;
			if(!bufferUnit.getVertexBuffer()){
		 		vBuffer = gl.createBuffer();
		 		bufferUnit.setVertexBuffer(vBuffer);
			} 

			vBuffer = bufferUnit.getVertexBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
			bufferUnit.setVertexData(new Float32Array(points));
			gl.bufferData(gl.ARRAY_BUFFER, bufferUnit.getVertexData(), gl.STATIC_DRAW);

			let cBuffer;
			if(!bufferUnit.getColorBuffer()){
			 	cBuffer = gl.createBuffer();
			 	bufferUnit.setColorBuffer(cBuffer);
			} 

			return true;

		}


		this.render = function(gl, input){
			if(!programCreated){
				programCreated = initProgram(gl);
				if(programCreated != true){
					return false;
				}
			}

			if(!buffersReady){
				buffersReady = initBuffers(gl);

				if(buffersReady != true){
					log("Failed to init buffers in MeshRenderer2D");
					return false;
				}
			}

			gl.enableVertexAttribArray(aPosition);
			gl.enableVertexAttribArray(aColor);

			gl.bindBuffer(gl.ARRAY_BUFFER, bufferUnit.getColorBuffer());
			gl.vertexAttribPointer(cColor, 4, gl.FLOAT, false, 0, 0);

			gl.bindBuffer(gl.ARRAY_BUFFER, bufferUnit.getVertexBuffer());
			gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);
			

			gl.drawArrays(gl.TRIANGLES, 0, bufferUnit.getVertexData().length / 6);
		}
			
	}
}