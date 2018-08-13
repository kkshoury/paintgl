class SceneComposer2D {
	constructor(){
		this.renderers = [[]];
		this.window = new WindowGL();
		this.textureManager = new TextureManager2D();
		this.fbManager = new FrameBufferManager(this.textureManager);

	}

	getScene(){
		return {
			addGeometry : function(){},
			removeGeomtry : function(){},
		}
	}

	init(config){
		let res = this.window.initCanvas(config.canvasId, document, config.canvasParent, config.w, config.h);
		this.gl = this.window.getContext();
		if(!res){
			log("Could not init canvas");
		}
	}

	addRenderer(renderer, pass){
		if(renderer){
			if(!pass){
				pass = 0;
			}

			if(!this.renderers[pass]){
				this.renderers[pass] = [];
			}

			this.renderers[pass].push(renderer);
		}
	}

	step(scene, time){
		let gl = this.gl;
		let bg = scene.backgroundColor;

		gl.clearColor(bg[0], bg[1], bg[2], bg[3]);
		gl.clear(gl.COLOR_BUFFER_BIT);
		this.renderers.forEach((pass) => {
			pass.forEach(r =>{
				if(r.on){
					let tex;
					if(r.input){
						tex = this.textureManager.getTexture2D(gl, r.input);
					}
					if(r.target){
						this.fbManager.bind(gl, r.target);
						r.render(gl, tex);
						this.fbManager.bind(gl, null);
					}
					else {
						let vp = scene.viewportDim;
						gl.viewport(vp[0], vp[1], vp[2], vp[3]);
						r.render(gl, tex);
					}					
				}
			});
			
		});
		
	}

	setColor(color){
		this.color = color;
	}

	setViewport(gl, width, height){
		gl.viewport(0, 0, width, height);
	}

	getContext(){
		return this.window.getContext();
	}
}