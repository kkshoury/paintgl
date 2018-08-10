class SceneComposer2D {
	constructor(){
		this.renderers = [];
		this.window = new WindowGL();
		this.textureManager = new TextureManager2D();
		// this.bufferManager = new BufferManager();

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

	addRenderer(renderer){
		if(renderer){
			this.renderers.push(renderer);
		}
	}

	render(){
		window.requestAnimationFrame((function(){
			this.gl.clearColor(1, 1, 1, 1);
			this.gl.clear(this.gl.COLOR_BUFFER_BIT);
			this.renderers.forEach((r) => {
				r.render(this.gl);
			});
		}).bind(this));
		
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