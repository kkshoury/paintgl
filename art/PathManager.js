function getMousePos(evt) {
	let canvas = document.getElementById("canvas");
    let rect = canvas.getBoundingClientRect();
    return [(evt.clientX - rect.left) / canvas.width * 2 -1, 
    		(evt.clientY - rect.top) / canvas.height * -2 + 1];
}

class PathManager2D {
	//listens for user input
	//creates Line objects

	constructor(gl){
		var __tempLines = [];
		var __tempLineCount = 0;
		this.lineRenderer = new LineRenderer(gl);
		paintgl.ArtManagers.CanvasManager.renderer.addRenderer(this.lineRenderer);
	
		var __handle = 0;
		var __committedHandles = [];
		var __tempHandles = [];
		function getNewLineHandle(){
			return __handle++;
		}

		this.addTempLine = function(x1, y1, x2, y2){
			if(arguments.length != 4){
				return -1;
			}

			let handle = getNewLineHandle();
			for(var i = 0; i < arguments.length; i++){
				__tempLines[handle*4 + i] = arguments[i];
			}

			this.lineRenderer.addTempLine([
				__tempLines[handle*4],
				__tempLines[handle*4 + 1],
				__tempLines[handle*4 + 2],
				__tempLines[handle*4 + 3] 
				]);

			return handle++;
		}

		this.removeTempLines = function(handle){
			__tempLines = [];
			__handle = 0;
			this.lineRenderer.removeTempLine();
		}

		this.commitLine = function(){
			for(var i = 0; i < __tempLines.length; i+=4){
			this.lineRenderer.addLine(
				__tempLines[i],
				__tempLines[i + 1],
				__tempLines[i + 2],
				__tempLines[i + 3] 
				);
			}

			__tempLines = [];
			__handle = 0;
		}
	}

	init(){
		this.lineRenderer.setLineColor(1.0, 0.0, 0.0, 1.0);
	}

	setLineColor(r, g, b, a){
		this.lineRenderer.setLineColor(r, g, b, a);

	}

}