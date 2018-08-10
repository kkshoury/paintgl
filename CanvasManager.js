var errlog = function(m){
	if(errlog.logErrors){
		console.log("Error: " + m)
	}
}

errlog.logErrors = true;

class WindowGL{
	constructor(){
		let __canvas = null;

		// this.scene = new SceneGraphicsManager();
		this.width = 0;
		this.height = 0;
		this.bgColor = [1.0, 1.0, 1.0, 1.0];
		this.contextFactory = new WebGLContextSingletonFactory();

		this.initCanvas = function(canvasId, dom, parentId, w, h){
			if(!canvasId || !dom || !parentId){
				errlog("failed to create <canvas> DOM element at parent = " + parentId);
				return false;
			}

			__canvas = dom.createElement(canvasId);
			let parent = dom.getElementById(parentId);
			if(parent && __canvas){
				__canvas.width = w;
				__canvas.height = h;
				__canvas.id = "canvas";
				
				this.contextFactory.setContextSource(__canvas);
				this.mouseEventEmitter = new MouseEventEmitter(__canvas, "GL_WINDOW");
				let gl = this.contextFactory.getWebGLContext(__canvas);
				gl.viewport(0, 0, __canvas.width, __canvas.height);
				
				parent.append(__canvas);
				return true;
			}

			return false;
		}

		this.getContext = function(){
			return this.contextFactory.getWebGLContext(__canvas);
		}
	}

	
	resize(width, height){

	}

	clear(){
		let gl = this.contextFactory.getWebGLContext(); 
		gl.clearColor(this.bgColor[0], this.bgColor[1], this.bgColor[2], this.bgColor[3]);
		gl.clear(this.gl.COLOR_BUFFER_BIT);

	}

	save(){

	}

	refresh(){

	}


}
