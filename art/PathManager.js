class PathManager2D {
	//listens for user input
	//creates Line objects

	constructor(){
		var __tempLines = [];
		var __tempLineCount = 0;
		this.lineRenderer = new LineRenderer();
	
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

		this.commitPathToLayer = function(){
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

			this.lineRenderer.target = this.fb.id;
			leo.Events.EventEmitter.shout("SCENE_CHANGED", null, "SCENE");
			this.lineRenderer.target = null;
			this.lineRenderer.clearLines();
		}
		
		this.removeAllPaths = function(){
			this.lineRenderer.clearLines();
			__tempLines = [];
			__handle = 0;
		}	
	}

	

	init(leo){
	}

	postInit(leo){
		let layer = leo.Advanced2D.RasterLayerManager.orderedLayers[0];
		this.fb = new FrameBuffer({
			"textureId" : layer.texture.id, 
			"texWidth": layer.texture.width,
			"texHeight": layer.texture.height
		});
		leo.Engine.RenderingEngine2D.addRenderer(this.lineRenderer, 1);

	}

	start(){
		this.lineRenderer.setLineColor(0.0, 0.0, 0.0, 1.0);
	}

	setLineColor(r, g, b, a){
		this.lineRenderer.setLineColor(r, g, b, a);
		leo.Events.EventEmitter.shout("SCENE_CHANGED", null, "SCENE");
	}

}