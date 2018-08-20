class FrameBufferManager {
	constructor(texManager){
		this.frameBufferData = {};
		this.gpuFrameBuffers = {};
		this.dirty = {};
		this.boundfb;
		this.texManager = texManager;

		leo.Events.EventEmitter.listen(this.addFramebuffer.bind(this), "FRAME_BUFFER_CREATED", "GRAPHICS_ENGINE");

	}


	addFramebuffer(fb){
		let id = fb.id;
		let fba = fb.attachedTextures;

		let colorAttachment = fba[0].colorAttachments;
		let depthAttachment = fba[0].depthAttachment;
		let stencilAttachment = fba[0].stencilAttachment;
		let textureTarget = fba[0].textureTarget;
		let textureId = fba[0].texture;
		let level = fba[0].level;

		this.frameBufferData[id] = fb;
		this.dirty[id] = true;
	}

	bind(gl, target){

		if(target == null){
			gl.bindFramebuffer(gl.FRAMEBUFFER, null);
			this.boundfb = null;
			return;
		}

		if(!this.frameBufferData[target] || this.boundfb == target){
			return;
		}

		if(this.dirty[target]){
			this.createFramebuffer(gl, target, this.frameBufferData[target]);
			this.dirty[target] = false;
		}

		let data = this.frameBufferData[target];
		let texture = this.texManager.getTexture2D(gl, data.attachedTextures[0].textureId);
		// gl.bindTexture(gl.TEXTURE_2D, texture);
		gl.bindFramebuffer(gl.FRAMEBUFFER, this.gpuFrameBuffers[target]);
		gl.viewport(0, 0, data.attachedTextures[0].texWidth, data.attachedTextures[0].texHeight);
		this.boundfb = target;
	}

	getFrameBuffer(id){
		return gpuFrameBuffers[id];
	}

	isDirty(id){
		return dirty[id] === true;
	}

	createFramebuffer(gl, fbId, targets){

		let fb = gl.createFramebuffer();
		if(!fb){
			return false;
		}

		this.gpuFrameBuffers[fbId] = fb;
		gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
		

		let data = this.frameBufferData[fbId];
		gl.viewport(0, 0, data.attachedTextures[0].texWidth, data.attachedTextures[0].texHeight);

		data.attachedTextures.forEach(fba =>{
			try{
				let targetTexture = this.texManager.getTexture2D(gl, fba.textureId);
				gl.bindTexture(gl.TEXTURE_2D, targetTexture);
				gl.framebufferTexture2D(
					gl.FRAMEBUFFER,
					gl[fba.attachmentPoint],
					gl[fba.textureTarget],
					targetTexture,
					fba.level
				);
				gl.bindTexture(gl.TEXTURE_2D, null);
			}
			catch(ex){
				log(ex);
				gl.bindTexture(gl.TEXTURE_2D, null);
			}

		});

		var status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
		if(status != gl.FRAMEBUFFER_COMPLETE){
			log("Framebuffer not complete");
		}
		gl.bindFramebuffer(gl.FRAMEBUFFER, null);


	}




}