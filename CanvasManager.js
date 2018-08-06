class CanvasManager{
	constructor(canvas){
		this.canvas = canvas;
		this.context = this.canvas.getContext("webgl");
		this.renderer = new MasterRenderer(this.context);
		this.__refresh = (function(){
			this.renderer.render(this.context);
		}).bind(this);

		let gl = this.context;
		gl.viewport(0, 0, canvas.width, canvas.height);
		if(canvas.mozImageSmoothingEnabled){
			canvas.mozImageSmoothingEnabled = false;
		}

	}

	getWebGLContext(){
		if(!this.context){
			this.context = this.canvas.getContext("webgl");
		}

		return this.context;
	}

	refresh(){
		window.requestAnimationFrame(this.__refresh);
	}
}