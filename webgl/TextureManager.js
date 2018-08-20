class TextureManager2D {
	constructor(){
		this.textureData = {};
		this.gpuTextures = {};
		this.dirty = {};
		leo.Events.EventEmitter.listen(this.addTexture.bind(this), "TEXTURE_CREATED", "GRAPHICS_ENGINE");
	}

	getTexture2D(gl, id){
		if(this.dirty[id] === undefined){
			return;
		}

		if(this.textureData[id] && this.dirty[id]){
			let res = this.createTexture(gl, id);
			if(res){
				this.dirty[id] = false;
			}
		}

		return this.gpuTextures[id];
	}

	isDirty(id){
		return this.dirty[id] === true;
	}

	createTexture(gl, textureId){
		let texture;
		if(textureId){
			if(this.textureData[textureId]){
				texture = this.textureData[textureId];
			}
			else {
				return false;
			}
		}
		if(texture.read == true && texture.dataReady == false){
			return false;
		}

		if(!this.dirty[textureId]){
			return false;
		}

		let glTexture = gl.createTexture();
		if(!glTexture){
			return false;
		}

		this.gpuTextures[textureId] = glTexture;

		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, glTexture);

		try{
			gl.texImage2D(
				gl.TEXTURE_2D, 
				texture.level, 
				gl[texture.internalformat], 
				texture.width, 
				texture.height, 
				texture.border, 
				gl[texture.format], 
				gl[texture.type], 
				texture.data
			);
		}  catch(ex){
			log(ex);
			return false;
		}


		 gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  		 gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
 		 gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
 		 // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	  	 // gl.generateMipmap(gl.TEXTURE_2D);
 			
 		 gl.bindTexture(gl.TEXTURE_2D, null);

 		 return true;
	}

	addTexture(e){
		let id = e.id;
		let props = e.props;

		if(props.data){
			props.dataReady = true;
		}

		this.textureData[id] = props;
		this.textureData[id].inGPU = false;
		this.dirty[id] = true;

	}


	disposeTexture(textureId){
		if(textureId){
			if(this.textureData[textureId]){
				//mark for dispose
			}
		}
	}


}