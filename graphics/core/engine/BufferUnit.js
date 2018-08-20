/*
Class that holds buffers (vertices, colors, normals, texture coordinates),
that share a common renderer or a commond shader program.

 */
class BufferUnit{
	constructor(){
		this.vertexData = null;
		this.colorData = null;
		this.normalData = null;
		this.texCoordData = null;
		this.mat4Data = null;

		this.vertexBuffer = null;
		this.colorBuffer = null;
		this.normalBuffer = null;
		this.texCoordBuffer = null;
		this.mat4Buffer = null;

		this.dirty = true;
		leo.Events.EventEmitter.shout("BUFFER_UNIT_CREATED", this, "BUFFERS");
		this.__ready = false;
	}

	setVertexData(float32array){
		this.vertexData = float32array;
		this.dirty = true;
		this.__ready = false;
		leo.Events.EventEmitter.shout("BUFFER_UNIT_CHANGED", this, "BUFFERS");

	}

	getVertexData(){
		return this.vertexData;
	}
	getVertexBuffer(){
		return this.vertexBuffer;
	}

	setVertexBuffer(glbuffer){
		this.vertexBuffer = glbuffer;
	}


	setTexCoordData(float32array){
		this.texCoordData = float32array;
		this.dirty = true;
		this.__ready = false;

		leo.Events.EventEmitter.shout("BUFFER_UNIT_CHANGED", this, "BUFFERS");
		
	}

	getTexCoordData(){
		return this.texCoordData;
	}
	getTexCoordBuffer(){
		return this.texCoordBuffer;
	}

	setTexCoordBuffer(glbuffer){
		this.texCoordBuffer = glbuffer;
	}

	setColorData(float32array){
		this.colorData = float32array;
		this.dirty = true;
		this.__ready = false;

		leo.Events.EventEmitter.shout("BUFFER_UNIT_CHANGED", this, "BUFFERS");

	}

	getColorData(){
		return this.colorData;
	}
	getColorBuffer(){
		return this.colorBuffer;
	}

	setColorBuffer(glbuffer){
		this.colorBuffer = glbuffer;
	}
	setDirty(bool){
		this.dirty = bool;
	}

	getMat4Data(){
		return this.mat4Data;
	}

	setMat4Data(float32array){
		this.__ready = false;
		this.mat4Data = float32array;
		this.dirty = true;
		leo.Events.EventEmitter.shout("BUFFER_UNIT_CHANGED", this, "BUFFERS");
	}

	getMat4Buffer(){
		return this.mat4Buffer;
	}

	setMat4Buffer(buffer){
		this.mat4Buffer = buffer;
	}

	isDirty(){
		return this.dirty;
	}

	addFloat32DataSource(src){
		if(!this.__src){
			this.__src = [];
		}

		this.__src.push(src);
		this.setDirty(true);
	}

	clear(){
		this.vertexData = null;
		this.colorData = null;
		this.texCoordData = null;
		this.normalData = null;
		this.mat4Data = null;

		this.vertexBuffer = null;
		this.normalBuffer = null;
		this.colorBuffer = null;
		this.mat4Buffer = null;
		this.texCoordBuffer = null;

		this.dirty = true;
		this.__ready = false;

		this.__src = [];
	}
	generateFloat32Data(){
		if(this.__ready){
			return;
		}		

		let vFloats = 0;
		let cFloats = 0;
		let mFloats = 0;

		this.__src.forEach(src =>{
			vFloats += src.getVertexFloat32Array().length;
			cFloats += src.getColorFloat32Array().length;
			mFloats += src.getMat4Float32Array().length;
		});

		let vfloat32 = new Float32Array(vFloats);
		let cfloat32 = new Float32Array(cFloats);
		let mfloat32 = new Float32Array(mFloats);

		let vi = 0;
		let ci = 0;
		let mi = 0;

		for(let i = 0; i < this.__src.length; i++){
			let vlength = this.__src[i].getVertexFloat32Array().length;
			for(let j = 0; j < vlength; j++){
				vfloat32[vi++] = this.__src[i].getVertexFloat32Array()[j];
			}
		}

		for(let i = 0; i < this.__src.length; i++){
			let clength = this.__src[i].getColorFloat32Array().length;
			for(let j = 0; j < clength; j++){
				cfloat32[ci++] = this.__src[i].getColorFloat32Array()[j];
			}
		}

		for(let i = 0; i < this.__src.length; i++){
			let mlength = this.__src[i].getMat4Float32Array().length;
			for(let j = 0; j < mlength; j++){
				mfloat32[mi++] = this.__src[i].getMat4Float32Array()[j];
			}
		}

		this.setVertexData(vfloat32);
		this.setColorData(cfloat32);
		this.setMat4Data(mfloat32);
		this.__ready = true;
	}		

}