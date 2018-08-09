class PaintGL2DPaintingManager{
	constructor(){
		// this.painter = Painter2D(); //animator
		this.canvasManager = new CanvasManager();
	}

	init(){
		let res = this.canvasManager.initCanvas("canvas", document, "maindiv", 800, 600);
		if(!res){
			log("Could not init canvas");
		}
	}

	setViewport(gl, width, height){
		gl.viewport(0, 0, width, height);
	}
	
	paint(gl){

	}

	getContext(){
		return this.canvasManager.getContext();
	}

	addRenderer(renderer, priority){

	}

	removeRenderer(renderer){

	}

	addControlRenderer(){

	}
}
