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

	init(){
		let res = this.window.initCanvas("canvas", document, "maindiv", 800, 600);
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

	step(time){
		this.gl.clearColor(1, 1, 1, 1);
		this.gl.clear(this.gl.COLOR_BUFFER_BIT);
		this.renderers.forEach((pass) => {
			pass.forEach(r =>{
				if(r.on){
					let tex;
					if(r.input){
						tex = this.textureManager.getTexture2D(this.gl, r.input);
					}
					if(r.target){
						this.fbManager.bind(this.gl, r.target);
						r.render(this.gl, tex);
						this.fbManager.bind(this.gl, null);
					}
					else {
						this.gl.viewport(0, 0, this.window.width, this.window.height);
						r.render(this.gl, tex);
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