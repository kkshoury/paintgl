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

		this.vertexBuffer = null;
		this.colorsBuffer = null;
		this.normalsBuffer = null;
		this.texCoordBuffer = null;

		this.dirty = true;
		paintgl.Events.EventEmitter.shout("BUFFER_UNIT_CREATED", this, "BUFFERS");
	}

	setVertexData(float32array){
		this.vertexData = float32array;
		this.dirty = true;
		paintgl.Events.EventEmitter.shout("BUFFER_UNIT_CHANGED", this, "BUFFERS");

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
		paintgl.Events.EventEmitter.shout("BUFFER_UNIT_CHANGED", this, "BUFFERS");
		
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

	setDirty(bool){
		this.dirty = bool;
	}

	isDirty(){
		return this.dirty;
	}

}