class MeshRenderer2D {
	constructor(on){
		let buffersReady = false;
		let bufferUnit = new BufferUnit();
		
		let programCreated = false;
		let program;
		let aPosition; 
		let aColor;
		let aMat3;

		let models = new Set();
		
		this.on = on;


		function initProgram(gl){
			program = Shaders.createPolygon2DProgram(gl);

			if(!program){
				log("Failed to init program in MeshRenderer2D");
				return false;
			}

			aPosition = gl.getAttribLocation(program, "a_position");
			aColor = gl.getAttribLocation(program, "a_color");
			aMat3 = gl.getAttribLocation(program, "a_mat");

			return true;
		}

		function initBuffers(gl){
			let vBuffer;
			bufferUnit.generateFloat32Data();
			if(!bufferUnit.getVertexBuffer()){
		 		vBuffer = gl.createBuffer();
		 		bufferUnit.setVertexBuffer(vBuffer);
			} 

			vBuffer = bufferUnit.getVertexBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
			// bufferUnit.setVertexData(getVertexFloat32Array());
			gl.bufferData(gl.ARRAY_BUFFER, bufferUnit.getVertexData(), gl.STATIC_DRAW);

			let cBuffer;
			if(!bufferUnit.getColorBuffer()){
			 	cBuffer = gl.createBuffer();
			 	bufferUnit.setColorBuffer(cBuffer);
			} 

			cBuffer = bufferUnit.getColorBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
			// bufferUnit.setVertexData(models[0].getColorFloat32Array());
			gl.bufferData(gl.ARRAY_BUFFER, bufferUnit.getColorData(), gl.STATIC_DRAW);

			let mBuffer;
			if(!bufferUnit.getMat4Buffer()){
			 	mBuffer = gl.createBuffer();
			 	bufferUnit.setMat4Buffer(mBuffer);
			} 

			mBuffer = bufferUnit.getMat4Buffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, mBuffer);
			// bufferUnit.setVertexData(models[0].getColorFloat32Array());
			gl.bufferData(gl.ARRAY_BUFFER, bufferUnit.getMat4Data(), gl.STATIC_DRAW);

			return true;

		}

		this.addModel = function(model){
			if(!models || !model){
				return false;
			}

			models.add(model);
			if(model.notifyDirty){
				model.notifyDirty(bufferUnit);
			}

			bufferUnit.addFloat32DataSource(model);
			buffersReady = false;
			return true;
		}


		this.reset = function(model){
			programCreated = false;
			buffersReady = false;
			bufferUnit = new BufferUnit();
		
			program = null;
			aPosition = null; 
			aColor = null;
			aMat3 = null;

			models = new Set();
		
		}

		this.removeModel = function(model){
			if(!model || !models){
				return false;
			}

			let val = models.delete(model);
			if(val){
				bufferUnit.removeFloat32DataSource(model);
				model.removeDirtyListener(bufferUnit);
				return true;
			}

			return false;
		}

	
		this.render = function(gl, input){
			if(models.length == 0){
				return;
			}

			if(!programCreated){
				programCreated = initProgram(gl);
				if(programCreated != true){
					return false;
				}
			}

			if(bufferUnit.isDirty()){
				buffersReady = initBuffers(gl);

				if(buffersReady != true){
					log("Failed to init buffers in MeshRenderer2D");
					return false;
				}
			}

			gl.useProgram(program);

			gl.enableVertexAttribArray(aPosition);
			gl.enableVertexAttribArray(aColor);
			gl.enableVertexAttribArray(aMat3);
			gl.enableVertexAttribArray(aMat3 + 1);
			gl.enableVertexAttribArray(aMat3 + 2);

			gl.bindBuffer(gl.ARRAY_BUFFER, bufferUnit.getColorBuffer());
			gl.vertexAttribPointer(aColor, 4, gl.FLOAT, false, 0, 0);

			gl.bindBuffer(gl.ARRAY_BUFFER, bufferUnit.getMat4Buffer());
			gl.vertexAttribPointer(aMat3, 3, gl.FLOAT, false,4 * 9, 0);

			// gl.bindBuffer(gl.ARRAY_BUFFER, bufferUnit.getMat4Buffer());
			gl.vertexAttribPointer(aMat3 + 1, 3, gl.FLOAT, false, 4 * 9, 4 * 3);

			// gl.bindBuffer(gl.ARRAY_BUFFER, bufferUnit.getMat4Buffer());
			gl.vertexAttribPointer(aMat3 + 2, 3, gl.FLOAT, false, 4 * 9, 4 * 6);

			gl.bindBuffer(gl.ARRAY_BUFFER, bufferUnit.getVertexBuffer());
			gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

			

			gl.drawArrays(gl.TRIANGLES, 0, bufferUnit.getVertexData().length/2);
		}
			
	}
}